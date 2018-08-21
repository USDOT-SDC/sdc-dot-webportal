from chalice import Chalice, Response
import boto3
import json, ast
import logging
from botocore.exceptions import ClientError
from chalice import BadRequestError, NotFoundError, ChaliceViewError, ForbiddenError
from chalice import CognitoUserPoolAuthorizer
import traceback
#import urllib2
import hashlib
from datetime import datetime
from boto3.dynamodb.conditions import Attr, Key
from chalice import CORSConfig
import time

cors_config = CORSConfig(
    allow_origin='*',
    allow_headers=['Content-Type','X-Amz-Date','Authorization','X-Api-Key','X-Amz-Security-Token','Access-Control-Allow-Origin'],
    max_age=600,
    expose_headers=['Content-Type','X-Amz-Date','Authorization','X-Api-Key','X-Amz-Security-Token','Access-Control-Allow-Origin'],
    allow_credentials=True
)

#Parameters used to deploy production setup
TABLENAME = ''
TABLENAME_DATASET = ''
APPSTREAM_S3_BUCKET_NAME = ''
APPSTREAM_DATASET_FOLDER_NAME = 'datasets/'
APPSTREAM_ALGORITHM_FOLDER_NAME = 'algorithm/'
APPSTREAM_DATASET_PATH = 'user/custom/'
RECEIVER = 'support@securedatacommons.com'
PROVIDER_ARNS = ''
RESTAPIID = ''
AUTHORIZERID = ''
TABLENAME_TRUSTED = ''
TABLENAME_EXPORT_FILE_REQUEST= ''

authorizer = CognitoUserPoolAuthorizer(
    '', provider_arns=[PROVIDER_ARNS])


app = Chalice(app_name='webportal')
logger = logging.getLogger()
dynamodb_client = boto3.resource('dynamodb')
appstream_client = boto3.client('appstream')

def get_user_details(id_token):
    try:
        apigateway = boto3.client('apigateway')
        response = apigateway.test_invoke_authorizer(
        restApiId=RESTAPIID,
        authorizerId=AUTHORIZERID,
        headers={
            'Authorization': id_token
        })
        roles_response=response['claims']['family_name']
        email=response['claims']['email']
        full_username=response['claims']['cognito:username'].split('\\')[1]
        roles_list_formatted = ast.literal_eval(json.dumps(roles_response))
        role_list= roles_list_formatted.split(",")

        roles=[]
        for r in role_list:
            if ":role/" in r:
                roles.append(r.split(":role/")[1])


        return { 'role' : roles , 'email': email, 'username': full_username }
    except BaseException as be:
        logging.exception("Error: Failed to get role from token" + str(be) )
        raise ChaliceViewError("Internal error occurred! Contact your administrator")

def get_datasets():

    try:
        table = dynamodb_client.Table(TABLENAME_DATASET)

        response = table.scan(TableName=TABLENAME_DATASET)

        return { 'datasets' : response }
    except BaseException as be:
        logging.exception("Error: Failed to get dataset" + str(be) )
        raise ChaliceViewError("Internal error occurred! Contact your administrator.")

@app.route('/user', authorizer=authorizer, cors=cors_config)
def get_user_info():

    user_info={}
    roles=[]
    try:
        id_token = app.current_request.headers['authorization']
        info_dict=get_user_details(id_token)
        user_info['role']=info_dict['role']
        user_info['email']=info_dict['email']
        user_info['username']=info_dict['username']
        user_info['datasets']=get_datasets()['datasets']['Items']
        trustedUsersTable = dynamodb_client.Table(TABLENAME_TRUSTED)

        response = trustedUsersTable.query(
            KeyConditionExpression=Key('UserID').eq(info_dict['username']),
            FilterExpression=Attr('TrustedStatus').eq('Trusted')
        )
        userTrustedStatus = {}
        for x in response['Items']:
            userTrustedStatus[x['Dataset-DataProvider-Datatype']] = 'Trusted'

        user_info['userTrustedStatus'] = userTrustedStatus
    except BaseException as be:
        logging.exception("Error: Failed to get user details from token or datasets and algorithm." + str(be) )
        raise ChaliceViewError("Internal error occurred! Contact your administrator.")
    table = dynamodb_client.Table(TABLENAME)

    # stack_names=set()

    # Extract the stack names associated with the roles passed

    # Get the item with role name
    try:
        response_table = table.get_item(Key={'username': user_info['username'] })
    except BaseException as be:
        logging.exception("Error: Could not perform get_item() on requested table.Verify requested table exist." + str(be) )
        raise ChaliceViewError("Internal error occurred! Contact your administrator.")

    # Convert unicode to ascii
    try:
        user_info['stacks']=ast.literal_eval(json.dumps(response_table['Item']['stacks']))
    except KeyError as ke:
        logging.exception("Error: Could not fetch the item for user: " + user_info['username'])
        raise NotFoundError("Unknown role '%s'" % (user_info['userinfo']))
    except BaseException as be:
        logging.exception("Error: Could not perform get_item() on requested table.Verify requested table exist." + str(be) )
        raise ChaliceViewError("Internal error occurred! Contact your administrator.")

    return Response(body=user_info,
                    status_code=200,
                    headers={'Content-Type': 'text/plain'})


@app.route('/streamingurl', methods=['POST'], authorizer=authorizer, cors=cors_config)
def get_streaming_url():
    params = app.current_request.query_params
    if not params or "stack_name" not in params or "username" not in params :
        logger.error("The query parameters 'stack_name' or 'username' is missing")
        raise BadRequestError("The query parameters 'stack_name' or 'username' is missing")


    # try:
    #     hash_object_user_id = hashlib.sha256(params['username'])
    #     hex_dig_user_id = hash_object_user_id.hexdigest()
    # except BaseException as be:
    #     logger.exception("Failed to create sha256 hash for userid: %s" % params['username'])
    #     raise ChaliceViewError("Internal error occurred! Contact your administrator.")
    #
    # try:
    #     client_s3 = boto3.client('s3')
    #     response = client_s3.put_object(
    #             Bucket=APPSTREAM_S3_BUCKET_NAME,
    #             Body='',
    #             Key=APPSTREAM_DATASET_PATH+hex_dig_user_id+'/'+APPSTREAM_DATASET_FOLDER_NAME
    #             )
    # except ClientError as ce:
    #     logger.exception("Failed to create datasets folder of user %s" % params['username'])
    #     raise ChaliceViewError("Internal error occurred! Contact your administrator.")
    #
    # try:
    #     client_s3 = boto3.client('s3')
    #     response = client_s3.put_object(
    #             Bucket=APPSTREAM_S3_BUCKET_NAME,
    #             Body='',
    #             Key=APPSTREAM_DATASET_PATH+hex_dig_user_id+'/'+APPSTREAM_ALGORITHM_FOLDER_NAME
    #             )
    # except ClientError as ce:
    #     logger.exception("Failed to create algorithm folder of user %s" % params['username'])
    #     raise ChaliceViewError("Internal error occurred! Contact your administrator.")

    # Create the appstream url.
    try:
        response = appstream_client.create_streaming_url(FleetName=params['fleet_name'], StackName=params['stack_name'],
                                                         UserId=params['username'])
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

@app.route('/send_email', methods=['POST'], authorizer=authorizer, cors=cors_config)
def send_email():
    ses_client = boto3.client('ses')

    params = app.current_request.query_params
    if not params or "sender" not in params or "message" not in params:
        logger.error("The query parameters 'sender' or 'message' is missing")
        raise BadRequestError("The query parameters 'sender' or 'message' is missing")
    #sender = params['sender']
    sender = RECEIVER
    message = params['message']

    try:
        response = ses_client.send_email(
            Destination={
                'BccAddresses': [
                ],
                'CcAddresses': [
                ],
                'ToAddresses': [
                    RECEIVER
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': message,
                    },
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': 'This is the message body in text format.',
                    },
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': 'Request email',
                },
            },
            Source=sender
        )
    except BaseException as ke:
        logging.exception("Failed to send email "+ str(ke) )
        raise NotFoundError("Failed to send email")

@app.route('/user_data', authorizer=authorizer, cors=cors_config)
def get_my_datasets():
    content = set()
    user_id = ''
    params = app.current_request.query_params
    # try:
    #     id_token = app.current_request.headers['authorization']
    #     info_dict=get_user_details(id_token)
    #     user_id=info_dict['username']
    # except BaseException as be:
    #     logging.exception("Error: Failed to get user_id/email from token" + str(be) )
    #     raise ChaliceViewError("Internal error occurred! Contact your administrator.")
    #
    # try:
    #     hash_object_user_id = hashlib.sha256(user_id)
    #     hex_dig_user_id = hash_object_user_id.hexdigest()
    # except BaseException as be:
    #     logger.exception("Failed to create sha256 hash for userid: %s" % user_id)
    #     raise ChaliceViewError("Internal error occurred! Contact your administrator.")

    try:
        client_s3 = boto3.client('s3')
        response = client_s3.list_objects(
            Bucket=params['userBucketName'],
            Prefix='{}/uploaded_files/'.format(params['username'])
        )
        export_response = client_s3.list_objects(
            Bucket=params['userBucketName'],
            Prefix='export_requests/'
        )
        total_content = {}
        total_export_content = {}
        if 'Contents' in export_response:
            total_export_content = export_response['Contents']
        if 'Contents' in response:
            total_content=response['Contents']
        for c in total_content:
            content.add(c['Key'])
        for c in total_export_content:
            content.add(c['Key'])

    except BaseException as ce:
        logger.exception("Failed to list datasets folder of user %s. %s" % (user_id,ce))
        raise ChaliceViewError("Internal error occurred! Contact your administrator.")

    # try:
    #     client_s3 = boto3.client('s3')
    #     response = client_s3.list_objects(
    #         Bucket=APPSTREAM_S3_BUCKET_NAME,
    #         Prefix=APPSTREAM_DATASET_PATH+hex_dig_user_id+'/'+APPSTREAM_ALGORITHM_FOLDER_NAME
    #     )
    #     total_content_algo = {}
    #     if 'Contents' in response:
    #         total_content_algo=response['Contents']
    #
    #     for c in total_content_algo:
    #         if not c['Key'].endswith(hex_dig_user_id+'/'+APPSTREAM_ALGORITHM_FOLDER_NAME):
    #             content.add(c['Key'].split(hex_dig_user_id+'/'+APPSTREAM_ALGORITHM_FOLDER_NAME)[1])
    #
    # except BaseException as ce:
    #     logger.exception("Failed to list algorithm folder of user %s. %s" % (user_id,ce))
    #     raise ChaliceViewError("Internal error occurred! Contact your administrator.")

    return Response(body=list(content),
                    status_code=200,
                    headers={'Content-Type': 'text/plain'})

@app.route('/instancestatus', authorizer=authorizer, cors=cors_config)
def get_instance_status():
    params = app.current_request.query_params
    if not params or "instance_id" not in params:
        logger.error("The query parameters 'instance_id' is missing")
        raise BadRequestError("The query parameters 'instance_id' is missing")

    try:
        client_ec2 = boto3.client('ec2')
        response = client_ec2.describe_instance_status(
            InstanceIds=[
                params['instance_id'],
            ]
        )
    except BaseException as be:
        logging.exception("Error: Failed to get info about instance" + str(be) )
        raise ChaliceViewError("Internal error at server side")

    return Response(body={'Status': response},
                    status_code=200,
                    headers={'Content-Type': 'text/plain'})

@app.route('/instance', methods=['POST'], authorizer=authorizer, cors=cors_config)
def perform_instance_action():
    params = app.current_request.query_params
    if not params or "instance_id" not in params:
        logger.error("The query parameters 'instance_id' is missing")
        raise BadRequestError("The query parameters 'instance_id' is missing")

    if not params or "action" not in params:
        logger.error("The query parameters 'action' is missing")
        raise BadRequestError("The query parameters 'action' is missing")

    if params['action'] == 'run':
        try:
            client_ec2 = boto3.client('ec2')
            response = client_ec2.start_instances(
                InstanceIds=[
                    params['instance_id'],
                ]
            )
        except BaseException as be:
            logging.exception("Error: Failed to start instance" + str(be) )
            raise ChaliceViewError("Internal error at server side")
    else:
        try:
            client_ec2 = boto3.client('ec2')
            response = client_ec2.stop_instances(
                InstanceIds=[
                    params['instance_id'],
                ],
                Force=True
            )
        except BaseException as be:
            logging.exception("Error: Failed to stop instance" + str(be) )
            raise ChaliceViewError("Internal error at server side")

    return Response(body={'Status': response},
                    status_code=200,
                    headers={'Content-Type': 'text/plain'})


@app.route('/dataset_dictionary', authorizer=authorizer, cors=cors_config)
def get_dataset_dictionary():
    params = app.current_request.query_params
    if not params or "readmepathkey" not in params or "readmebucket" not in params:
        logger.error("The query parameters 'readmepathkey' or 'readmebucket' is missing")
        raise BadRequestError("The query parameters 'readmepathkey' or 'readmebucket' is missing")

    try:
        client_s3 = boto3.client('s3')
        response = client_s3.get_object(
        Bucket=params['readmebucket'],
        Key=params['readmepathkey']
        )
        data = response['Body'].read()
    except BaseException as be:
        logging.exception("Error: Failed to get data from s3 file" + str(be) )
        raise ChaliceViewError("Internal error at server side")

    return Response(body={'data': data },
                    status_code=200,
                    headers={'Content-Type': 'text/plain'})

@app.route('/presigned_url', authorizer=authorizer, cors=cors_config)
def get_presigned_url():
    params = app.current_request.query_params
    try:
        client_s3 = boto3.client('s3')
        response = client_s3.generate_presigned_url('put_object', Params={'Bucket': params['bucket_name'], 'Key': '{}/uploaded_files/{}'.format(params["username"], params['file_name']), 'ContentType': params['file_type'], 'Metadata': {'download':'true', 'export':'false', 'publish':'true'}}, ExpiresIn=3600, HttpMethod='PUT')
        logging.info("Response from pre-signed url - " + response)
    except BaseException as be:
        logging.exception("Error: Failed to generate presigned url" + str(be))
        raise ChaliceViewError("Failed to get presigned url")
    return Response(body=response,
                    status_code=200,
                    headers={'Content-Type': 'text/plain'})


@app.route('/download_url', authorizer=authorizer, cors=cors_config)
def get_download_url():
    params = app.current_request.query_params
    try:
        client_s3 = boto3.client('s3')
        response = client_s3.generate_presigned_url('get_object', Params={'Bucket': params['bucket_name'], 'Key': params['file_name']}, ExpiresIn=600, HttpMethod='GET')
        logging.info("Response from pre-signed url - " + response)
    except BaseException as be:
        logging.exception("Error: Failed to generate presigned url" + str(be))
        raise ChaliceViewError("Failed to get presigned url")
    return Response(body=response,
                    status_code=200,
                    headers={'Content-Type': 'text/plain'})

@app.route('/get_metadata_s3', authorizer=authorizer, cors=cors_config)
def get_metadata_s3_object():
    params = app.current_request.query_params
    logger.setLevel("INFO")
    logging.info("Params - " + params['bucket_name'])
    logging.info("Params filename- " + params['file_name'])
    try:
        client_s3 = boto3.client('s3')
        response = client_s3.get_object(Bucket=params['bucket_name'],Key=params['file_name'])
        logging.info("S3 object metadata response - " + str(response["Metadata"]))
    except BaseException as be:
        logging.exception("Error: Failed to get S3 metadata" + str(be))
        raise ChaliceViewError("Failed to get s3 metadata")
    return Response(body=response["Metadata"],
                    status_code=200,
                    headers={'Content-Type': 'text/plain'})

def get_combined_export_workflow():
    availableDatasets = get_datasets()['datasets']['Items']
    combinedExportWorkflow = {}
    for dataset in availableDatasets:
        if 'exportWorkflow' in dataset:
            combinedExportWorkflow.update(dataset['exportWorkflow'])
    return combinedExportWorkflow


@app.route('/export', methods=['POST'], authorizer=authorizer, cors=cors_config)
def export():
    paramsQuery = app.current_request.query_params
    paramsString = paramsQuery['message']
    logger.setLevel("INFO")
    logging.info("Received request {}".format(paramsString))
    params = json.loads(paramsString)
    try:
        selctedDataSet=params['selectedDataInfo']['selectedDataSet']
        selectedDataProvider=params['selectedDataInfo']['selectedDataProvider']
        selectedDatatype=params['selectedDataInfo']['selectedDatatype']
        combinedDataInfo=selctedDataSet + "-" + selectedDataProvider + "-" + selectedDatatype
        userID=params['UserID']

        combinedExportWorkflow = get_combined_export_workflow()

        trustedWorkflowStatus = \
        combinedExportWorkflow[selctedDataSet][selectedDataProvider]['datatypes'][selectedDatatype]['Trusted']['WorkflowStatus']

        nonTrustedWorkflowStatus = \
            combinedExportWorkflow[selctedDataSet][selectedDataProvider]['datatypes'][selectedDatatype]['NonTrusted']['WorkflowStatus']

        listOfPOC=combinedExportWorkflow[selctedDataSet][selectedDataProvider]['ListOfPOC']
        emailContent = ""
        dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
        acceptableUse = 'Decline'
        if 'acceptableUse' in params and params['acceptableUse']:
            acceptableUse = params['acceptableUse']

        if 'trustedRequest' in params:
            trustedUsersTable = dynamodb.Table(TABLENAME_TRUSTED)

            trustedStatus=params['trustedRequest']['trustedRequestStatus']

            if acceptableUse == 'Decline':
                trustedStatus = 'NonTrusted'
                emailContent = "<br/>Trusted status has been declined to <b>" + userID + "</b> for dataset <b>" + combinedDataInfo + "</b>"
            elif trustedWorkflowStatus == 'Notify':
                trustedStatus='Trusted'
                emailContent="<br/>Trusted status has been approved to <b>" + userID + "</b> for dataset <b>" + combinedDataInfo + "</b>"
            else:
                emailContent = "<br/>Trusted status has been requested by <b>" + userID + "</b> for dataset <b>" + combinedDataInfo + "</b>"

            response = trustedUsersTable.put_item(
                Item = {
                    'UserID': userID,
                    'Dataset-DataProvider-Datatype': combinedDataInfo,
                    'TrustedStatus': trustedStatus,
                    'UsagePolicyStatus': acceptableUse,
                    'ReqReceivedTimestamp': int(time.time()),
                    'LastUpdatedTimestamp': datetime.utcnow().strftime("%Y%m%d")
                }
            )
        requestReviewStatus = params['RequestReviewStatus']
        download = 'false'
        export = 'true'
        publish = 'false'
        if nonTrustedWorkflowStatus == 'Notify':
            requestReviewStatus = 'Approved'
            download = 'true'
            publish = 'true'
            export = 'false'
            emailContent += "<br/>Export request has been approved to <b>" + userID + "</b> for dataset <b>" + params['S3Key'] + "</b>"
        else:
            emailContent += "<br/>Export request has been requested by <b>" + userID + "</b> for dataset <b>" + params['S3Key'] + "</b>"

        exportFileRequestTable = dynamodb.Table(TABLENAME_EXPORT_FILE_REQUEST)
        hashed_object = hashlib.md5(params['S3Key'].encode())
        timemills = int(time.time())
        response = exportFileRequestTable.put_item(
            Item={
                'S3KeyHash': hashed_object.hexdigest(),
                'Dataset-DataProvider-Datatype': combinedDataInfo,
                'ApprovalForm': params['ApprovalForm'],
                'RequestReviewStatus': requestReviewStatus,
                'S3Key': params['S3Key'],
                'RequestedBy_Epoch': userID + "_" + str(timemills),
                'RequestedBy': userID,
                'TeamBucket': params['TeamBucket'],
                'ReqReceivedTimestamp': timemills
                # 'RequestID' : params['RequestID']
            }
        )
        availableDatasets = get_datasets()['datasets']['Items']
        logging.info("Available datasets:" + str(availableDatasets))

        s3 = boto3.resource('s3')
        s3_object = s3.Object(params['TeamBucket'], params['S3Key'])
        #s3_object.metadata.update()
        s3_object.copy_from(CopySource={'Bucket': params['TeamBucket'], 'Key': params['S3Key']},
                            Metadata={'download': download, 'export': export, 'publish': publish},
                            MetadataDirective='REPLACE')

        #send email to List of POC
        send_notification(listOfPOC,emailContent)


    except BaseException as be:
        logging.exception("Error: Failed to process export request" + str(be))
        raise ChaliceViewError("Failed to process export request")

    return Response(body=response,
                    status_code=200,
                    headers={'Content-Type': 'text/plain'})

def send_notification(listOfPOC, emailContent):
    ses_client = boto3.client('ses')
    sender = RECEIVER

    try:
        response = ses_client.send_email(
            Destination={
                'BccAddresses': [
                ],
                'CcAddresses': [
                ],
                'ToAddresses': listOfPOC,
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': emailContent,
                    },
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': 'This is the notification message body in text format.',
                    },
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': 'Export Notification',
                },
            },
            Source=sender
        )
    except BaseException as ke:
        logging.exception("Failed to send notification "+ str(ke))
        raise NotFoundError("Failed to send notification")

@app.route('/export/requests', methods=['POST'], authorizer=authorizer, cors=cors_config)
def getSubmittedRequests():
    paramsQuery = app.current_request.query_params
    paramsString = paramsQuery['message']
    logger.setLevel("INFO")
    logging.info("Received request {}".format(paramsString))
    params = json.loads(paramsString)

    useremail = params['userEmail']
    userdatasets = []
    response = {"exportRequests": [], "trustedRequests": []}
    try:
        combinedExportWorkflow = get_combined_export_workflow()

        for dataset in combinedExportWorkflow:
            for dataprovider in combinedExportWorkflow[dataset]:
                listOfPOC = combinedExportWorkflow[dataset][dataprovider]['ListOfPOC']
                if listOfPOC and useremail in listOfPOC:
                    for datatype in combinedExportWorkflow[dataset][dataprovider]['datatypes']:
                        userdatasets.append(dataset + "-" + dataprovider + "-" + datatype)

        #Query all submitted requests for the selected datatype
        exportFileRequestTable = dynamodb_client.Table(TABLENAME_EXPORT_FILE_REQUEST)
        trustedRequestTable = dynamodb_client.Table(TABLENAME_TRUSTED)
        for userdataset in userdatasets:
            exportFileRequestResponse = exportFileRequestTable.query(
                IndexName='DataInfo-ReqReceivedtimestamp-index',
                KeyConditionExpression=Key('Dataset-DataProvider-Datatype').eq(userdataset))
            if exportFileRequestResponse['Items']:
                response['exportRequests'].append(exportFileRequestResponse['Items'])

            trustedRequestResponse = trustedRequestTable.query(
                IndexName='DataInfo-ReqReceivedtimestamp-index',
                KeyConditionExpression=Key('Dataset-DataProvider-Datatype').eq(userdataset))

            if trustedRequestResponse['Items']:
                response['trustedRequests'].append(trustedRequestResponse['Items'])


        logging.info(response)
    except BaseException as be:
        logging.exception("Error: Failed to get submit requests" + str(be))
        raise ChaliceViewError("Failed to get submit requests")

    return Response(body=response,
                    status_code=200,
                    headers={'Content-Type': 'application/json'})

@app.route('/export/requests/updatefilestatus', methods=['POST'], authorizer=authorizer, cors=cors_config)
def updatefilestatus():
    paramsQuery = app.current_request.query_params
    paramsString = paramsQuery['message']
    logger.setLevel("INFO")
    logging.info("Received request {}".format(paramsString))
    params = json.loads(paramsString)
    response = {}
    try:
        status=params['status']
        s3KeyHash=params['key1']
        requestedBy_Epoch=params['key2']
        datainfo = params['datainfo']


        download = 'false'
        export = 'true'
        publish = 'false'
        metadata = {'download': download, 'export': export, 'publish': publish}

        if status == "Approved":
            download = 'true'
            publish = 'true'
            export = 'false'
            metadata = {'download': download, 'export': export, 'publish': publish}
        elif status == "TrustedApproved":
            metadata = {'download': download, 'export': export, 'publish': publish , datainfo : 'true'}

        logging.info(metadata)
        logging.info(params)

        exportFileRequestTable = dynamodb_client.Table(TABLENAME_EXPORT_FILE_REQUEST)
        exportFileRequestTable.update_item(
                            Key={
                                'S3KeyHash': s3KeyHash,
                                'RequestedBy_Epoch': requestedBy_Epoch
                            },
                            UpdateExpression="set RequestReviewStatus = :val",
                            ExpressionAttributeValues = {
                                ':val': status
                            },
                            ReturnValues="UPDATED_NEW"
                        )
        s3 = boto3.resource('s3')
        s3_object = s3.Object(params['TeamBucket'], params['S3Key'])
        #s3_object.metadata.update(metadata)
        s3_object.copy_from(CopySource={'Bucket': params['TeamBucket'], 'Key': params['S3Key']},
                            Metadata=metadata,
                            MetadataDirective='REPLACE')

    except BaseException as be:
        logging.exception("Error: Failed to updatefilestatus" + str(be))
        raise ChaliceViewError("Failed to updatefilestatus")

    return Response(body=response,
                    status_code=200,
                    headers={'Content-Type': 'application/json'})

@app.route('/export/requests/updatetrustedtatus', methods=['POST'], authorizer=authorizer, cors=cors_config)
def updatetrustedtatus():
    paramsQuery = app.current_request.query_params
    paramsString = paramsQuery['message']
    logger.setLevel("INFO")
    logging.info("Received request {}".format(paramsString))
    params = json.loads(paramsString)
    response = {}
    try:
        status=params['status']
        key1=params['key1']
        key2=params['key2']

        trustedRequestTable = dynamodb_client.Table(TABLENAME_TRUSTED)
        trustedRequestTable.update_item(
                            Key={
                                'UserID': key1,
                                'Dataset-DataProvider-Datatype': key2
                            },
                            UpdateExpression="set TrustedStatus = :val",
                            ExpressionAttributeValues = {
                                ':val': status
                            },
                            ReturnValues="UPDATED_NEW"
                        )

    except BaseException as be:
        logging.exception("Error: Failed to updatetrustedtatus" + str(be))
        raise ChaliceViewError("Failed to updatetrustedtatus")

    return Response(body=response,
                    status_code=200,
                    headers={'Content-Type': 'application/json'})