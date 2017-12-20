from chalice import Chalice, Response
import boto3
import json, ast
import logging
from botocore.exceptions import ClientError
from chalice import BadRequestError, NotFoundError, ChaliceViewError, ForbiddenError
from chalice import CognitoUserPoolAuthorizer
import urllib2
from chalice import CORSConfig
cors_config = CORSConfig(
    allow_origin='*',
    allow_headers=['Content-Type','X-Amz-Date','Authorization','X-Api-Key','X-Amz-Security-Token','Access-Control-Allow-Origin'],
    max_age=600,
    expose_headers=['Content-Type','X-Amz-Date','Authorization','X-Api-Key','X-Amz-Security-Token','Access-Control-Allow-Origin'],
    allow_credentials=True
)


TABLENAME = 'roles-to-stack-and-fleet-mapping'

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

    stack_names=set()
        
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
        try:
            for i in formatted_item['mappings']:
                stack_names.add(i['stack_name'])
        except BaseException as be:
            logging.exception("Error:Could not fetch the stacknames for role." + str(be) )
            raise ChaliceViewError("Internal error at server side")                

    return Response(body=list(stack_names),
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
    user_id = ""
    roles=[]
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
