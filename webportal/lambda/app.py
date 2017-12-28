from chalice import Chalice, Response
import boto3
import json, ast
import logging
from botocore.exceptions import ClientError
from chalice import BadRequestError, NotFoundError, ChaliceViewError, ForbiddenError
from chalice import CognitoUserPoolAuthorizer
import urllib2
import hashlib
from chalice import CORSConfig
cors_config = CORSConfig(
    allow_origin='*',
    allow_headers=['Content-Type','X-Amz-Date','Authorization','X-Api-Key','X-Amz-Security-Token','Access-Control-Allow-Origin'],
    max_age=600,
    expose_headers=['Content-Type','X-Amz-Date','Authorization','X-Api-Key','X-Amz-Security-Token','Access-Control-Allow-Origin'],
    allow_credentials=True
)


TABLENAME = 'roles-to-stack-and-fleet-mapping'
TABLENAME_DATASET = 'AvailableDataset'
APPSTREAM_S3_BUCKET_NAME = 'appstream2-36fb080bb8-us-east-1-911061262852'
APPSTREAM_DATASET_FOLDER_NAME = 'datasets/'
APPSTREAM_DATASET_PATH = 'user/custom/'

app = Chalice(app_name='webportal')
logger = logging.getLogger()
dynamodb_client = boto3.resource('dynamodb')
appstream_client = boto3.client('appstream')

def get_user_details(id_token):
    try:
        apigateway = boto3.client('apigateway')    
        response = apigateway.test_invoke_authorizer(
        restApiId='u2zksemc1h',
        authorizerId='ne1w0w',
        headers={
            'Authorization': id_token
        })
        roles_response=response['claims']['family_name']
        email=response['claims']['email']
        roles_list_formatted = ast.literal_eval(json.dumps(roles_response))
        role_list= roles_list_formatted.split(",")
        
        print(role_list)
        roles=[]
        for r in role_list:
            if ":role/" in r:
                roles.append(r.split(":role/")[1])

        
        return { 'role' : roles , 'email': email}
    except BaseException as be:
        logging.exception("Error: Failed to get role from token" + str(be) )
        raise ChaliceViewError("Internal error at server side") 



authorizer = CognitoUserPoolAuthorizer(
    'test_cognito', provider_arns=['arn:aws:cognito-idp:us-east-1:911061262852:userpool/us-east-1_uAgXIUy4Q'])

@app.route('/stacks', authorizer=authorizer, cors=cors_config)
def list_stacks():  
    roles=[]
    try:
        id_token = app.current_request.headers['authorization']
        info_dict=get_user_details(id_token)
        roles=info_dict['role']       
    except BaseException as be:
        logging.exception("Error: Failed to get role from token" + str(be) )
        raise ChaliceViewError("Internal error at server side") 


    table = dynamodb_client.Table(TABLENAME)

    # stack_names=set()
        
    # Extract the stack names associated with the roles passed        
    for role in roles:
        # Get the item with role name
        try:
            response_table = table.get_item(Key={'role': role })
        except BaseException as be:
            logging.exception("Error: Could not perform get_item() on requested table.Verify requested table exist." + str(be) )
            raise ChaliceViewError("Internal error at server side")                

        # Convert unicode to ascii
        try:                
            formatted_item=ast.literal_eval(json.dumps(response_table['Item']))
        except KeyError as ke:
            logging.exception("Error: Could not fetch the item for role: " + role)
            raise NotFoundError("Unknown role '%s'" % (role))                            

        # List the stack name
        # try:
        #     for i in formatted_item['mappings']:
        #         stack_names.add(i['stack_name'])
        # except BaseException as be:
        #     logging.exception("Error:Could not fetch the stacknames for role." + str(be) )
        #     raise ChaliceViewError("Internal error at server side")                

    return Response(body=formatted_item,
                    status_code=200,
                    headers={'Content-Type': 'text/plain'})              


@app.route('/streaming-url', authorizer=authorizer, cors=cors_config)
def get_streaming_url():          
    params = app.current_request.query_params
    if not params or "stack_name" not in params:
        logger.error("The query parameters 'stack_name' is missing")
        raise BadRequestError("The query parameters 'stack_name' is missing")
    stack_name = params['stack_name']
    table = dynamodb_client.Table(TABLENAME)

    # The following values should be retrieved from Cognito authorizer.
    # user_id = "deepak@sdc.usdot"
    # roles=['DOT-TrustedPartners']
    try:
        id_token = app.current_request.headers['authorization']
        info_dict=get_user_details(id_token)
        roles=info_dict['role'] 
        user_id=info_dict['email']     
    except BaseException as be:
        logging.exception("Error: Failed to get role from token" + str(be) )
        raise ChaliceViewError("Internal error at server side")    

    # Check if the user has access to the stack.
    found = None

    for role in roles:
        try:
            response = table.get_item(Key={'role': role})
            if not 'Item' in response:
                logging.exception("Error: Could not fetch the item for role: " + role)
                raise ChaliceViewError("Unknown role '%s'" % (role))
            item = response['Item']
            formatted_item = ast.literal_eval(json.dumps(item))
            for mapping in formatted_item['mappings']:
                if mapping['stack_name'] == stack_name:
                    found = mapping
                    break
            if found:
                break
        except KeyError as ke:
            logging.exception("Error: Could not fetch the item for role: " + role)
            raise NotFoundError("Unknown role '%s'" % (role))
        except ClientError as ce:
            logger.exception("Failed to fetch mappings for role: %s".format(role))
            raise ChaliceViewError("Internal error occurred! Contact your administrator.")

    if not found:
        logger.error("Attempt to access forbidden stack with name %s" % stack_name)
        raise ForbiddenError("You do not have access to stack %s" % stack_name)

    try:
        hash_object_user_id = hashlib.sha256(user_id)
        hex_dig_user_id = hash_object_user_id.hexdigest()
    except BaseException as be:
        logger.exception("Failed to create sha256 hash for userid: %s" % user_id)
        raise ChaliceViewError("Internal error occurred! Contact your administrator.")

    try:
        client_s3 = boto3.client('s3')
        response = client_s3.put_object(
                Bucket=APPSTREAM_S3_BUCKET_NAME,
                Body='',
                Key=APPSTREAM_DATASET_PATH+hex_dig_user_id+'/'+APPSTREAM_DATASET_FOLDER_NAME
                )
    except ClientError as ce:
        logger.exception("Failed to create datasets folder of user %s" % user_id)
        raise ChaliceViewError("Internal error occurred! Contact your administrator.")
 
    # Create the appstream url.
    try:
        response = appstream_client.create_streaming_url(FleetName=found['fleet_name'], StackName=found['stack_name'],
                                                         UserId=user_id)
        #return {'url': response['StreamingURL']}

        return Response(body=response['StreamingURL'],
                status_code=200,
                headers={'Content-Type': 'text/plain'})
    except KeyError as ke:
        logger.exception('received malformed mapping data from dynamodb. %s' % mapping)
        raise ChaliceViewError("Internal error occurred! Contact your administrator.")
    except ClientError as ce:
        logger.exception("Creation of streaming url failed for [user=%s, Fleet=%s, stack=%s]" % (
        user_id, found['fleet_name'], found['stack_name']))
        raise ChaliceViewError("Error creating streaming url")


        # {
        #   "role1": [
        #     {
        #       "stack_name": "dot-sdc-default-tools-stack",
        #       "fleet_name": "dot-sdc-default-tools-fleet"
        #     },
        #     {
        #       "stack_name": "dot-sdc-esri-stack",
        #       "fleet_name": "dot-sdc-esri-fleet"
        #     }
        #   ]
        # }
        # See the README documentation for more examples.
        #

@app.route('/datasets', authorizer=authorizer, cors=cors_config)
def get_datasets():  

    params = app.current_request.query_params
    if not params or "datasetcode" not in params or "datasettype" not in params:
        logger.error("The query parameters 'datasetcode' or 'datasettype' is missing")
        raise BadRequestError("The query parameters 'datasetcode' or 'datasettype' is missing")
    datasetcode = params['datasetcode']
    datasettype = params['datasettype']

    table = dynamodb_client.Table(TABLENAME_DATASET)
        

    # Get the item with role name
    try:
        response_table = table.get_item(Key={'DatasetCode': datasetcode, 'DatasetType': datasettype })
    except BaseException as be:
        logging.exception("Error: Could not perform get_item() on requested table.Verify requested table exist." + str(be) )
        raise ChaliceViewError("Internal error at server side")                

    # Convert unicode to ascii
    try:
        formatted_item=ast.literal_eval(json.dumps(response_table['Item']))
    except KeyError as ke:
        logging.exception("Error: Could not fetch the item for DatasetCode: " + datasetcode + " and DatasetType: "+ datasettype)
        raise NotFoundError("Unknown parameter '%s' and '%s'" % (datasetcode,datasettype))                                           

    return Response(body=formatted_item,
                    status_code=200,
                    headers={'Content-Type': 'text/plain'})              

@app.route('/access_dataset', authorizer=authorizer, cors=cors_config)
def get_access_dataset():
    ses_client = boto3.client('ses')

    receiver = 'pratiksha.mandale@reancloud.com'
    params = app.current_request.query_params
    if not params or "sender" not in params or "bucket_name" not in params:
        logger.error("The query parameters 'sender' or 'bucket_name' is missing")
        raise BadRequestError("The query parameters 'sender' or 'bucket_name' is missing")
    sender = params['sender']
    bucket_name = params['bucket_name']

    try:
        response = ses_client.send_email(
            Destination={
                'BccAddresses': [
                ],
                'CcAddresses': [
                ],
                'ToAddresses': [
                    receiver
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': 'Give access to User: ' + sender + ' to bucket: ' + bucket_name,
                    },
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': 'This is the message body in text format.',
                    },
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': 'Access Request email',
                },
            },
            Source=sender
        )
    except BaseException as ke:
        logging.exception("Failed to send email "+ str(ke) )
        raise NotFoundError("Failed to send email")

@app.route('/my_datasets', authorizer=authorizer, cors=cors_config)
def get_my_datasets():  
    datasets_content = set()
    user_id = ''
    try:
        id_token = app.current_request.headers['authorization']
        info_dict=get_user_details(id_token)
        user_id=info_dict['email']     
    except BaseException as be:
        logging.exception("Error: Failed to get user_id/email from token" + str(be) )
        raise ChaliceViewError("Internal error at server side")

    try:
        hash_object_user_id = hashlib.sha256(user_id)
        hex_dig_user_id = hash_object_user_id.hexdigest()
    except BaseException as be:
        logger.exception("Failed to create sha256 hash for userid: %s" % user_id)
        raise ChaliceViewError("Internal error occurred! Contact your administrator.")

    try:
        client_s3 = boto3.client('s3')
        response = client_s3.list_objects(
            Bucket=APPSTREAM_S3_BUCKET_NAME,
            Prefix=APPSTREAM_DATASET_PATH+hex_dig_user_id+'/'+APPSTREAM_DATASET_FOLDER_NAME
        )
        print(response['Contents'])

        total_content=response['Contents']

        
        for c in total_content:
            if not c['Key'].endswith(hex_dig_user_id+'/'+APPSTREAM_DATASET_FOLDER_NAME):
                datasets_content.add(c['Key'].split(hex_dig_user_id+'/'+APPSTREAM_DATASET_FOLDER_NAME)[1])
    except BaseException as ce:
        logger.exception("Failed to create datasets folder of user %s. %s" % (user_id,ce))
        raise ChaliceViewError("Internal error occurred! Contact your administrator.")
                                           
    return Response(body=list(datasets_content),
                    status_code=200,
                    headers={'Content-Type': 'text/plain'}) 

