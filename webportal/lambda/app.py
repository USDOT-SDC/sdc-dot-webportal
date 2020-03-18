from chalice import Chalice, Response
import boto3
import json, ast
import logging
import uuid
from botocore.exceptions import ClientError
from chalice import BadRequestError, NotFoundError, ChaliceViewError, ForbiddenError
from chalice import CognitoUserPoolAuthorizer
import traceback
#import urllib2
import hashlib
from datetime import datetime
import datetime
from boto3.dynamodb.conditions import Attr, Key
from chalice import CORSConfig
import time
import os

cors_config = CORSConfig(
    allow_origin='*',
    allow_headers=['Content-Type','X-Amz-Date','Authorization','X-Api-Key','X-Amz-Security-Token','Access-Control-Allow-Origin'],
    max_age=600,
    expose_headers=['Content-Type','X-Amz-Date','Authorization','X-Api-Key','X-Amz-Security-Token','Access-Control-Allow-Origin'],
    allow_credentials=True
)

app = Chalice(app_name='webportal')
logger = logging.getLogger()
dynamodb_client = boto3.resource('dynamodb')
appstream_client = boto3.client('appstream')

PROVIDER_ARNS = os.getenv("IDP_PROVIDER_ARNS")
TABLENAME_USER_STACKS = os.getenv("TABLENAME_USER_STACKS")
TABLENAME_AVAILABLE_DATASET = os.getenv("TABLENAME_AVAILABLE_DATASET")
RECEIVER = os.getenv("RECEIVER_EMAIL")
RESTAPIID = os.getenv("RESTAPIID")
AUTHORIZERID = os.getenv("AUTHORIZERID")
TABLENAME_AUTOEXPORT_USERS = os.getenv("TABLENAME_AUTOEXPORT_USERS")
TABLENAME_TRUSTED_USERS = os.getenv("TABLENAME_TRUSTED_USERS")
TABLENAME_EXPORT_FILE_REQUEST= os.getenv("TABLENAME_EXPORT_FILE_REQUEST")
TABLENAME_MANAGE_USER = os.getenv("TABLENAME_MANAGE_USER")
TABLENAME_MANAGE_USER_INDEX = os.getenv("TABLENAME_MANAGE_USER_INDEX")
TABLENAME_MANAGE_DISK = os.getenv("TABLENAME_MANAGE_DISK")
TABLENAME_MANAGE_DISK_INDEX = os.getenv("TABLENAME_MANAGE_DISK_INDEX")
TABLENAME_MANAGE_UPTIME = os.getenv("TABLENAME_MANAGE_UPTIME")
TABLENAME_MANAGE_UPTIME_INDEX = os.getenv("TABLENAME_MANAGE_UPTIME_INDEX")


authorizer = CognitoUserPoolAuthorizer(
   'dev-sdc-dot-cognito-pool', provider_arns=[PROVIDER_ARNS])

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
        table = dynamodb_client.Table(TABLENAME_AVAILABLE_DATASET)

        response = table.scan(TableName=TABLENAME_AVAILABLE_DATASET)

        return { 'datasets' : response }
    except BaseException as be:
        logging.exception("Error: Failed to get dataset" + str(be) )
        raise ChaliceViewError("Internal error occurred! Contact your administrator.")

def get_user_trustedstatus(userid):
    trustedUsersTable = dynamodb_client.Table(TABLENAME_TRUSTED_USERS)

    response = trustedUsersTable.query(
        KeyConditionExpression=Key('UserID').eq(userid),
        FilterExpression=Attr('TrustedStatus').eq('Trusted')
    )
    userTrustedStatus = {}
    for x in response['Items']:
        userTrustedStatus[x['Dataset-DataProvider-Datatype']] = 'Trusted'

    return userTrustedStatus

def get_user_autoexportstatus(userid):
    autoExportUsersTable = dynamodb_client.Table(TABLENAME_AUTOEXPORT_USERS)

    response = autoExportUsersTable.query(
        KeyConditionExpression=Key('UserID').eq(userid),
        FilterExpression=Attr('AutoExportStatus').eq('Approved')
    )
    userAutoExportStatus = {}
    for x in response['Items']:
        userAutoExportStatus[x['Dataset-DataProvider-Datatype']] = 'Approved'

    return userAutoExportStatus

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
        user_info['userTrustedStatus'] = get_user_trustedstatus(info_dict['username'])
        user_info['userAutoExportStatus'] = get_user_autoexportstatus(info_dict['username'])
    except BaseException as be:
        logging.exception("Error: Failed to get user details from token or datasets and algorithm." + str(be) )
        raise ChaliceViewError("Internal error occurred! Contact your administrator.")
    table = dynamodb_client.Table(TABLENAME_USER_STACKS)


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
        data = response['Body'].read().decode('utf-8')
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

        exportFileRequestTable = dynamodb_client.Table(TABLENAME_EXPORT_FILE_REQUEST)
        exportFileRequestResponse = exportFileRequestTable.scan(
            Select= 'ALL_ATTRIBUTES',
            FilterExpression=Attr('S3Key').eq(params['file_name'])
        )
        if exportFileRequestResponse["Items"]:
            response["Metadata"]["requestReviewStatus"] = exportFileRequestResponse["Items"][0]["RequestReviewStatus"]
        else:
            response["Metadata"]["requestReviewStatus"] = "-1"

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

def get_user_details_from_username(username):
    try:
        table = dynamodb_client.Table(TABLENAME_USER_STACKS)  
        response_table = table.get_item(Key={'username': username })
        team_name = response_table['Item']['teamName']
    except BaseException as be:
        logging.exception("Error: Failed to get the team name for the user" + str(be))
        raise ChaliceViewError("Failed to get the team name for the user")
    return team_name

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
        team_name = get_user_details_from_username(userID)

        id_token = app.current_request.headers['authorization']
        info_dict=get_user_details(id_token)
        user_email=info_dict['email']

        combinedExportWorkflow = get_combined_export_workflow()

        trustedWorkflowStatus = \
        combinedExportWorkflow[selctedDataSet][selectedDataProvider]['datatypes'][selectedDatatype]['Trusted']['WorkflowStatus']

        nonTrustedWorkflowStatus = \
            combinedExportWorkflow[selctedDataSet][selectedDataProvider]['datatypes'][selectedDatatype]['NonTrusted']['WorkflowStatus']

        listOfPOC=combinedExportWorkflow[selctedDataSet][selectedDataProvider]['ListOfPOC']
        emailContent = ""
        dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
        acceptableUse = 'Decline'

        # verify if user is already trusted for selected combinedDataInfo
        userTrustedStatus = get_user_trustedstatus(userID)
        userTrustedStatusForSelectedDataset = combinedDataInfo in userTrustedStatus and userTrustedStatus[combinedDataInfo] == 'Trusted';


        if 'acceptableUse' in params and params['acceptableUse']:
            acceptableUse = params['acceptableUse']

        if 'trustedRequest' in params:
            trustedUsersTable = dynamodb.Table(TABLENAME_TRUSTED_USERS)

            trustedStatus=params['trustedRequest']['trustedRequestStatus']

            if acceptableUse == 'Decline':
                trustedStatus = 'Untrusted'
                emailContent = "<br/>Trusted status has been declined to <b>" + userID + "</b> for dataset <b>" + combinedDataInfo + "</b>"
            elif trustedWorkflowStatus == 'Notify':
                trustedStatus='Trusted'
                emailContent="<br/>Trusted status has been approved to <b>" + userID + "</b> for dataset <b>" + combinedDataInfo + "</b>"
            else:
                emailContent = "<br/>Trusted status has been requested by <b>" + userID + "</b> for dataset <b>" + combinedDataInfo + "</b>"

            response = trustedUsersTable.put_item(
                Item = {
                    'UserID': userID,
                    'UserEmail': user_email,
                    'Dataset-DataProvider-Datatype': combinedDataInfo,
                    'TrustedStatus': trustedStatus,
                    'UsagePolicyStatus': acceptableUse,
                    'ReqReceivedTimestamp': int(time.time()),
                    'LastUpdatedTimestamp': datetime.datetime.utcnow().strftime("%Y%m%d")
                }
            )
        if 'autoExportRequest' in params:
            autoExportUsersTable = dynamodb.Table(TABLENAME_AUTOEXPORT_USERS)

            autoExportStatus = params['autoExportRequest']['autoExportRequestStatus']
            autoExportReason = params['autoExportRequest']['autoExportRequestReason']
            autoExportDataInfo = combinedDataInfo.split('-')[0] + '-' + combinedDataInfo.split('-')[1] + '-' + params['autoExportRequest']['autoExportRequestDataset']

            send_notification(listOfPOC,"Auto-Export status has been requested by <b>" + userID + "</b> for dataset <b>" + autoExportDataInfo + "</b>", 'Auto-Export Request')

            response = autoExportUsersTable.put_item(
                            Item = {
                                'UserID': userID,
                                'UserEmail': user_email,
                                'Dataset-DataProvider-Datatype': autoExportDataInfo,
                                'AutoExportStatus': autoExportStatus,
                                'ReqReceivedTime': int(time.time()),
                                'LastUpdatedTime': datetime.datetime.utcnow().strftime("%Y%m%d"),
                                'Justification': autoExportReason
                            }
                        )

        requestReviewStatus = params['RequestReviewStatus']
        download = 'false'
        export = 'true'
        publish = 'false'
        if nonTrustedWorkflowStatus == 'Notify' or userTrustedStatusForSelectedDataset is True:
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
                'ReqReceivedTimestamp': timemills,
                'UserEmail': user_email,
                'ReqReceivedDate': datetime.datetime.now().strftime('%Y-%m-%d')
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

def send_notification(listOfPOC, emailContent, subject = 'Export Notification'):
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
                    'Data': subject,
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
    response = {"exportRequests": [], "trustedRequests": [], "autoExportRequests": []}
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
        trustedRequestTable = dynamodb_client.Table(TABLENAME_TRUSTED_USERS)
        autoExportRequestTable = dynamodb_client.Table(TABLENAME_AUTOEXPORT_USERS)
        for userdataset in userdatasets:
            logging.info("Dataset: " + userdataset)
            # Data File Request query
            exportFileRequestResponse = exportFileRequestTable.query(
                IndexName='DataInfo-ReqReceivedtimestamp-index',
                KeyConditionExpression=Key('Dataset-DataProvider-Datatype').eq(userdataset))
            if exportFileRequestResponse['Items']:
                response['exportRequests'].append(exportFileRequestResponse['Items'])

            # Trusted User Request query
            trustedRequestResponse = trustedRequestTable.query(
                IndexName='DataInfo-ReqReceivedtimestamp-index',
                KeyConditionExpression=Key('Dataset-DataProvider-Datatype').eq(userdataset))
            if trustedRequestResponse['Items']:
                response['trustedRequests'].append(trustedRequestResponse['Items'])

        # Auto-export uses derived data types that has no limit of potential datatypes so prefix must be used
        userdatasetprefixes = []
        for ds in userdatasets:
            prefix = ds.split('-')[0] + '-' + ds.split('-')[0]
            if prefix not in userdatasetprefixes:
                userdatasetprefixes.append(prefix)

        for datasetprefix in userdatasetprefixes:
            logging.info("Dataset Prefix: " + datasetprefix)

            # Auto-Export Request query
            autoExportRequestResponse = autoExportRequestTable.scan(
                FilterExpression=Attr('Dataset-DataProvider-Datatype').begins_with('CVP-WYDOT'))
            if autoExportRequestResponse['Items']:
                response['autoExportRequests'].append(autoExportRequestResponse['Items'])

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
        userEmail = params['userEmail']


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
        # Send notification to the analyst if his request is approved or rejected
        listOfPOC = []
        listOfPOC.append(userEmail)
        emailContent = "<br/>The Status of the Export Request made by you for the file <b>" + params['S3Key'] + "</b> has been changed to <b>" + params['status'] + "</b>"
        send_notification(listOfPOC, emailContent)

    except BaseException as be:
        logging.exception("Error: Failed to updatefilestatus" + str(be))
        raise ChaliceViewError("Failed to updatefilestatus")

    return Response(body=response,
                    status_code=200,
                    headers={'Content-Type': 'application/json'})

@app.route('/export/requests/exportFileforReview', methods=['POST'], authorizer=authorizer, cors=cors_config)
def exportFileforReview():
    paramsQuery = app.current_request.query_params
    paramsString = paramsQuery['message']
    logger.setLevel("INFO")
    logging.info("Received request {}".format(paramsString))
    params = json.loads(paramsString)
    response = {}
    try:
        provider_team_bucket = params['provider_team_bucket']
        team_bucket=params['team_bucket']
        s3Key=params['s3Key']
        team_name = params['teamName']
        fileName = s3Key.split('/')[-1]
        s3 = boto3.resource('s3')
        copy_source = {
            'Bucket': params['team_bucket'],
            'Key': params['s3Key']
        }
        bucket = s3.Bucket(provider_team_bucket)
        review_path_for_provider = params['userName'] + "/" + "export_reviews/" + team_name + "/" + fileName
        bucket.copy(copy_source, review_path_for_provider)

    except BaseException as be:
        logging.exception("Error: Failed to export file for review" + str(be))
        raise ChaliceViewError("Failed to export file for review")

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
        userEmail = params['userEmail']

        trustedRequestTable = dynamodb_client.Table(TABLENAME_TRUSTED_USERS)
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
        # Send notification to the analyst if his request is approved or rejected
        listOfPOC = []
        listOfPOC.append(userEmail)
        emailContent = "<br/>The Status of the Trusted Status Request made by you for the Dataset <b>" + key2 + "</b> has been changed to <b>" + params['status'] + "</b>"
        send_notification(listOfPOC, emailContent)

    except BaseException as be:
        logging.exception("Error: Failed to updatetrustedtatus" + str(be))
        raise ChaliceViewError("Failed to updatetrustedtatus")

    return Response(body=response,
                    status_code=200,
                    headers={'Content-Type': 'application/json'})

@app.route('/export/requests/updateautoexportstatus', methods=['POST'], authorizer=authorizer, cors=cors_config)
def updateautoexportstatus():
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
        userEmail = params['userEmail']

        autoExportRequestTable = dynamodb_client.Table(TABLENAME_AUTOEXPORT_USERS)
        autoExportRequestTable.update_item(
                            Key={
                                'UserID': key1,
                                'Dataset-DataProvider-Datatype': key2
                            },
                            UpdateExpression="set AutoExportStatus = :val",
                            ExpressionAttributeValues = {
                                ':val': status
                            },
                            ReturnValues="UPDATED_NEW"
                        )
        # Send notification to the analyst if their request is approved or rejected
        listOfPOC = []
        listOfPOC.append(userEmail)
        emailContent = "<br/>The Status of the Auto-Export Status Request made by you for the Dataset <b>" + key2 + "</b> has been changed to <b>" + params['status'] + "</b>. "
        if params['status'] == 'Approved':
            emailContent = emailContent + 'An SDC Admin will now assign auto-export permissions to your SDC account. Please wait to be contacted by an SDC Admin that your new permissions have been assigned before attempting to use auto-export.'
        send_notification(listOfPOC, emailContent, 'Auto-Export Request Response')

        # NEW
        if params['status'] == 'Approved':
            listOfPOC = [RECEIVER]
            emailContent = "<br/>Auto-Export status has been approved for <b>" + key1 + "</b> for the Dataset-DataProvider-Datatype <b>" + key2 + "</b>. Please perform next steps following this SOP: https://securedatacommons.atlassian.net/wiki/spaces/SD/pages/265519105/SOP+-+Assigning+S3+Auto-Export+IAM+Roles."
            send_notification(listOfPOC, emailContent, 'Auto-Export Action Required')

    except BaseException as be:
        logging.exception("Error: Failed to updateautoexportstatus" + str(be))
        raise ChaliceViewError("Failed to updateautoexportstatus")

        return Response(body=response,
                        status_code=200,
                        headers={'Content-Type': 'application/json'})
    return

@app.route('/manage_user_workstation', authorizer=authorizer, cors=cors_config)
def manage_user_workstation():
    paramsQuery = app.current_request.query_params
    paramsString = paramsQuery['wsrequest']
    logger.setLevel("INFO")
    logging.info("Received request {}".format(paramsString))
    params = json.loads(paramsString)
    response = {}
    try:
        user_requests_process(params)
    except BaseException as be:
        logging.exception("Error: Failed to process manage workstation request" + str(be))
        raise ChaliceViewError("Failed to process manage workstation request")

    return Response(body=response,
                    status_code=200,
                    headers={'Content-Type': 'application/json'})

def user_requests_process(params):
    manageWorkstation = params['manageWorkstation']
    manageDiskspace = params['manageDiskspace']
    manageWorkStationAndDiskspace = params['manageWorkStationAndDiskspace']
    manageUptimeAndWorkstation = params['manageUptimeAndWorkstation']
    startAfterResize = params['startAfterResize']
    print(manageWorkstation)
    print(manageDiskspace)
    print(manageWorkStationAndDiskspace)
    print(manageUptimeAndWorkstation)
    print(startAfterResize)
    if manageWorkstation == True:
        resize_workstation(params)
        insert_request_to_table(params)
        update_configuration_type_to_table(params)
    if manageDiskspace == True:
        response=attach_ebs_volume(params)
    if manageWorkStationAndDiskspace == True:
        resize_workstation(params)
        insert_request_to_table(params)
        update_configuration_type_to_table(params)
        response=attach_ebs_volume(params)
    if manageUptimeAndWorkstation == True:
        insert_schedule_uptime_to_table(params)
    if startAfterResize == True:
        state=get_ec2_instance_state(params)
        if state != "running":
         ec2_instance_start(params)

def resize_workstation(params):
    try:
        ##state = get_ec2_instances(params['instance_id'],'running')
        state=get_ec2_instance_state(params)
        instance_id = params['instance_id']
        requested_instance_type = params['requested_instance_type']
        print(state)
        if state == "running":
           ec2_instance_stop(instance_id)
        modify_instance(instance_id, requested_instance_type)
        ### send email
        workstation_instance_request_notification(params)

    except ClientError as e:
        logging.exception("Error: Failed to insert record into Dynamo Db Table with exception - {}".format(e))


def ec2_instance_stop(instance_id):
    print("stopping instance_id: " + instance_id)  
    client = boto3.client('ec2',region_name='us-east-1')

# Stop the instance
    client.stop_instances(InstanceIds=[instance_id])
 #   waiter=client.get_waiter('instance_stopped')
 #   waiter.wait(InstanceIds=[instance_id])

def modify_instance(instance_id, request_instance_type):
    print("Modifying instance_id: " + instance_id + " to " + request_instance_type)  
    client = boto3.client('ec2',region_name='us-east-1')
    try:
        client.modify_instance_attribute(InstanceId=instance_id,Attribute='instanceType', Value=request_instance_type)
    except ClientError as e:
        print(e)   

def insert_request_to_table(params):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table(TABLENAME_MANAGE_USER)

    username = params['username']
    instance_id = params['instance_id']
    resp = table.query(
    # Add the name of the index you want to use in your query.
    IndexName=TABLENAME_MANAGE_USER_INDEX,
    KeyConditionExpression=Key('username').eq(username),FilterExpression=Attr('instance_id').eq(instance_id))
    active = False
    for item in resp['Items']:
        reqID=item['RequestId']
        ###print(reqID)
        table.update_item(
            Key={
            'RequestId': reqID,
            'username': username
            },
            UpdateExpression='set is_active = :active',
            ExpressionAttributeValues={':active': active })

    try:
        request_date = datetime.datetime.now()
        request_date = str(request_date)
        table.put_item(
            Item={
                    'RequestId': str(uuid.uuid4()),
                    'username': params['username'],
                    'user_email': params['user_email'],
                    'instance_id': params['instance_id'],
                    'default_instance_type': params['default_instance_type'],
                    'requested_instance_type': params['requested_instance_type'],
                    'operating_system': params['operating_system'],
                    'request_date': request_date,
                    'schedule_from_date': params['workstation_schedule_from_date'],
                    'schedule_to_date': params['workstation_schedule_to_date'],
                    'is_active': True
                }
            )
    except ClientError as e:
        logging.exception("Error: Failed to insert record into Dynamo Db Table with exception - {}".format(e))

def insert_schedule_uptime_to_table(params):
    instance_id = params['instance_id']
    ec2 = boto3.resource('ec2', region_name='us-east-1')
    ec2.create_tags(Resources=[instance_id], Tags=[{'Key':'Action', 'Value':'KeepRunning'}])
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table(TABLENAME_MANAGE_UPTIME)

    username = params['username']
    instance_id = params['instance_id']
    resp = table.query(
        # Add the name of the index you want to use in your query.
        IndexName=TABLENAME_MANAGE_UPTIME_INDEX,
        KeyConditionExpression=Key('username').eq(username),FilterExpression=Attr('instance_id').eq(instance_id))
    active = False
    for item in resp['Items']:
        reqID=item['RequestId']
    ###   print(reqID)
        table.update_item(
        Key={
        'RequestId': reqID,
        'username': username
        },
        UpdateExpression='set is_active = :active',
        ExpressionAttributeValues={':active': active })

    try:
        request_date = datetime.datetime.now()
        request_date = str(request_date)
        table.put_item(
            Item={
                    'RequestId': str(uuid.uuid4()),
                    'username': params['username'],
                    'user_email': params['user_email'],
                    'instance_id': params['instance_id'],
                    'operating_system': params['operating_system'],
                    'request_date': request_date,
                    'schedule_from_date': params['uptime_schedule_from_date'],
                    'schedule_to_date': params['uptime_schedule_to_date'],
                    'is_active': True
                }
            )
        workstation_uptime_request_notification(params)
    except ClientError as e:
        logging.exception("Error: Failed to insert record into Dynamo Db Table with exception - {}".format(e))

def insert_disk_request_to_table(params,volume_id,size):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table(TABLENAME_MANAGE_DISK)
    username = params['username']
    instance_id = params['instance_id']
    resp = table.query(
    # Add the name of the index you want to use in your query.
    IndexName=TABLENAME_MANAGE_DISK_INDEX,
    KeyConditionExpression=Key('username').eq(username),FilterExpression=Attr('instance_id').eq(instance_id))
    active = False
    for item in resp['Items']:
        reqID=item['RequestId']
        #### print(reqID)
        table.update_item(
            Key={
            'RequestId': reqID,
            'username': username
            },
            UpdateExpression='set is_active = :active',
            ExpressionAttributeValues={':active': active })

    try:
        request_date = datetime.datetime.now()
        request_date = str(request_date)
        table.put_item(
            Item={
                    'RequestId': str(uuid.uuid4()),
                    'username': params['username'],
                    'user_email': params['user_email'],
                    'instance_id': params['instance_id'],
                    'default_instance_type': params['default_instance_type'],
                    'requested_instance_type': params['default_instance_type'],
                    'operating_system': params['operating_system'],
                    'request_date': request_date,
                    'schedule_from_date': params['diskspace_schedule_from_date'],
                    'schedule_to_date': params['diskspace_schedule_to_date'],
                    'volume_id': volume_id,
                    'volume_size': size,
                    'is_active': True
                }
            )
    except ClientError as e:
        logging.exception("Error: Failed to insert record into Dynamo Db Table with exception - {}".format(e))

def update_volume_number_to_table(params,vol_number):
    instance_id = params['instance_id']
    username = params['username']
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table(TABLENAME_USER_STACKS)
    str_vol_number = str(vol_number)
    try:
        resp = table.query(KeyConditionExpression=Key('username').eq(username))

        map = -1
        map_num = -1
        for item in resp['Items']:
            for stack in (item['stacks']):
                map_num = map_num + 1
                if stack['instance_id'] == instance_id:
                    map = map_num
        if map == -1:
            print('Instance id ' + instance_id + ' not found in '+ TABLENAME_USER_STACKS)
            return -1
        table.update_item(
            Key={
            'username': username,
            },
            UpdateExpression='SET stacks[' + str(map) +'].volumes = :volumes',
            ExpressionAttributeValues={':volumes': str_vol_number })
    except ClientError as e:
        logging.exception("Error: Failed to update record into Dynamo Db Table with exception - {}".format(e))

def update_configuration_type_to_table(params):
    print(params)
    vcpu = params['vcpu']
    memory = params['memory']
    instance_id = params['instance_id']
    username = params['username']
    current_configuration = "vCPUs:" + str(vcpu) + ",RAM(GiB):" + str(memory)
    current_instance_type = params['requested_instance_type']
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table(TABLENAME_USER_STACKS)
    try:
        resp = table.query(KeyConditionExpression=Key('username').eq(username))

        map = -1
        map_num = -1
        for item in resp['Items']:
            for stack in (item['stacks']):
                map_num = map_num + 1
                if stack['instance_id'] == instance_id:
                    map = map_num
        if map == -1:
            print('Instance id ' + instance_id + ' not found in '+ TABLENAME_USER_STACKS)
            return -1
        table.update_item(
            Key={
            'username': username,
            },
            UpdateExpression='set stacks[' + str(map) + '].current_configuration = :conf,stacks[' + str(map) +'].current_instance_type = :type',
            ExpressionAttributeValues={
                ':conf': current_configuration,
                ':type': current_instance_type
            })
    except ClientError as e:
        logging.exception("Error: Failed to update record into Dynamo Db Table with exception - {}".format(e))


def number_of_ec2_volumes(instance_id):
    i = 0
    ec2 = boto3.resource('ec2', region_name='us-east-1')
    instance = ec2.Instance(instance_id)
    volumes = instance.volumes.all()
    for v in volumes:
        ## print(v.id)
        i = i + 1
    return i

def create_ebs_volume(instance_id,platform,zone,size):
    tag = str(platform) + str(instance_id)
    client = boto3.client('ec2',region_name='us-east-1')
    ec2 = boto3.resource('ec2', region_name='us-east-1')
    volume = ec2.create_volume(
        AvailabilityZone=zone,
        Encrypted=True,
        Size=size,
        VolumeType='gp2',
        TagSpecifications=[
            {
            'ResourceType': 'volume',
            'Tags': [
                {
                'Key': 'Name',
                'Value': tag
                },
            ]
            },
        ]
    )
    print(volume)
    V = str(volume)
    vol,vol1 = V.split("=", 1)
    vol = vol1.replace('\'','')
    volume = vol.replace(')','')
    client.get_waiter('volume_available').wait(VolumeIds=[volume])
    return volume

############
def attach_ebs_volume(params):
    instance_id = params['instance_id']
    size = int(params['required_diskspace'])
    ### check if instance has more than one volumes
    vol_number=number_of_ec2_volumes(instance_id)
    if vol_number > 1:
        print("Instance " + instance_id + " " + " has " + str(vol_number) + " volumes already")
        return vol_number
    vol_number = vol_number + 1
    client = boto3.client('ec2',region_name='us-east-1')
    state=get_ec2_instance_state(params)
    print('ret: ',state)
    if state != 'running':
        ec2_instance_start(params)
    zone=ec2_instance_availability_zone(instance_id)
    print(zone)
    platform=ec2_instance_platform(instance_id)
    if platform != 'windows':
        platform = 'linux'
    print(platform)
    ### create and get volume_id
    volume_id=create_ebs_volume(instance_id,platform,zone,size)
    response = client.attach_volume(
        Device='/dev/sdb',
        InstanceId=instance_id,
        VolumeId=volume_id)
    waiter = client.get_waiter('volume_in_use')
    waiter.wait(VolumeIds=[volume_id])
    ###
    ###time.sleep(5)
    print('inserting volume_id to DB')
    insert_disk_request_to_table(params,volume_id,size)
    update_volume_number_to_table(params,vol_number)
    #### format volume or mount
    state=get_ec2_instance_state(params)
    print('debug: ',state)
    if platform == 'windows':
        ssm_ec2_instance_windows(instance_id)
    if platform == 'linux':
        ssm_ec2_instance_linux(instance_id)
    ### send mail here
    workstation_diskspace_request_notification(params)
    return response

############
def ssm_ec2_instance_windows(instance_id):
    print("Initializing disk2 on instance_id: " + instance_id)
    ssm = boto3.client('ssm',region_name='us-east-1' )
    try:
        response = ssm.send_command( InstanceIds=[instance_id],
        DocumentName='AWS-RunPowerShellScript',
        Parameters={ "commands":[ """Get-Disk | Where partitionstyle -eq ‘raw’ |
                                 Initialize-Disk -PartitionStyle MBR -PassThru |
                                 New-Partition -AssignDriveLetter -UseMaximumSize |
                                 Format-Volume -FileSystem NTFS -NewFileSystemLabel “disk2” -Confirm:$false""" ]  },
                                 MaxErrors='20' )
    except Exception as e:
        logging.error("send command error: {0}".format(e))
        raise e
    command_id = response['Command']['CommandId']
    print('command ID',command_id)
    print(response)

def ssm_ec2_instance_linux(instance_id):
    print("EBS mounting on instance_id: " + instance_id)
    ssm = boto3.client('ssm',region_name='us-east-1' )
    response = ssm.send_command( InstanceIds=[instance_id],
    DocumentName='AWS-RunShellScript',
    Parameters={ "commands":[ """lsblk;
    sudo mkfs -t ext4 /dev/xvdb
    cd /
    mkdir -p /data1
    sudo mount /dev/xvdb  /data1/
    cat /etc/fstab | grep data1
    if [ $? -ne 0 ]; then
    echo "/dev/xvdb       /data1/   ext4    defaults,nofail  0   0" >> /etc/fstab
    fi
    """
    ]  },MaxErrors='20' )
    command_id = response['Command']['CommandId']
    print('Run command id',command_id)
    #print(response)


def ec2_instance_platform(instance_id):
    ec2 = boto3.resource('ec2')
    instance = ec2.Instance(instance_id)
    return instance.platform

def ec2_instance_availability_zone(instance_id):
    client = boto3.client('ec2')
    responses = client.describe_instances(InstanceIds=[instance_id])
    for response in responses["Reservations"]:
        for instance in response["Instances"]:
            availability_zone = instance["Placement"]["AvailabilityZone"]
            return availability_zone

def get_ec2_instance_state(params):
    instance_id = params['instance_id']
    ec2 = boto3.resource('ec2', region_name='us-east-1')
    instance = ec2.Instance(instance_id)
    return instance.state['Name']

#################
def ec2_instance_start(params):
    instance_id = params['instance_id']
    print("Starting instance_id: " + instance_id)
    client = boto3.client('ec2',region_name='us-east-1')

# Start the instance
    try:
        client.start_instances(InstanceIds=[instance_id])
        #  waiter=client.get_waiter('instance_running')
        #  waiter.wait(InstanceIds=[instance_id])
    except ClientError as e:
        print(e)

######
def manage_workstation_send_email(email,subject,body_text):
    SENDER = "SDC Administrator <support@securedatacommons.com>"
    RECIPIENT = email
    AWS_REGION = "us-east-1"

# The subject line for the email.
    SUBJECT = subject
# The email body for recipients with non-HTML email clients.
    BODY_TEXT = body_text

# The character encoding for the email.
    CHARSET = "UTF-8"

# Create a new SES resource and specify a region.
    client = boto3.client('ses',region_name=AWS_REGION)

# Try to send the email.
    try: #Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    RECIPIENT,
                ],
            },
            Message={
                'Body': {
                    'Text': {
                        'Charset': CHARSET,
                        'Data': BODY_TEXT,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': SUBJECT,
                },
            },
            Source=SENDER,
        )
# Display an error if something goes wrong.     
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])

def format_date(date):
    yyyy = date[0:4]
    mm = date[5:7]
    dd = date[8:10]
    formated_date = str(mm)+'/'+str(dd)+'/'+str(yyyy)
    return formated_date

def workstation_instance_request_notification(params):

    subject = 'SDC: New instance type for your workstation has been Scheduled'
    email = params['user_email']
    instance_type = params['requested_instance_type']
    schedule_from_date = format_date(params['workstation_schedule_from_date'])
    schedule_to_date = format_date(params['workstation_schedule_to_date'])

    BL0 = "Dear SDC User \r\n\n"
    BL1 = "You just requested " + instance_type + " instance type as your new workstation." 
    BL2 = "Your request has been scheduled from " + str(schedule_from_date) + " to " +  str(schedule_to_date) + ". "
    BL3 = "You will receive an email two days before your schedule expires."
    BL4 = "Please reach out to the SDC Support Team if you have any questions."
    BL5 = "\n\nThank you,\n SDC Support Team"

    body_text = (BL0 + "\r\n" + BL1 + "\n" + BL2 + "\n" + BL3 + "\n" + BL4 + BL5)
    manage_workstation_send_email(email,subject,body_text)

def workstation_uptime_request_notification(params):

    subject = 'SDC: New workstation uptime has been Scheduled'
    email = params['user_email']
    schedule_from_date = format_date(params['uptime_schedule_from_date'])
    schedule_to_date = format_date(params['uptime_schedule_to_date'])

    BL0 = "Dear SDC User \r\n\n"
    BL1 = "Your request for a new uptime for your workstation has been scheduled." 
    BL2 = "Your request has been scheduled from " + str(schedule_from_date) + " to " +  str(schedule_to_date) + ". "
    BL3 = "You will receive an email two days before your schedule expires."
    BL4 = "Please reach out to the SDC Support Team if you have any questions."
    BL5 = "\n\nThank you,\n SDC Support Team"

    body_text = (BL0 + "\r\n" + BL1 + "\n" + BL2 + "\n" + BL3 + "\n" + BL4 + BL5)
    manage_workstation_send_email(email,subject,body_text)

def workstation_diskspace_request_notification(params):

    subject = 'SDC: New diskspace on your workstation has been Scheduled'
    email = params['user_email']
    size = params['required_diskspace']
    schedule_from_date = format_date(params['diskspace_schedule_from_date'])
    schedule_to_date = format_date(params['diskspace_schedule_to_date'])

    BL0 = "Dear SDC User \r\n\n"
    BL1 = "You just requested  " + str(size) + "Gib of new disk storage for your workstation." 
    BL2 = "Your request has been scheduled from " + str(schedule_from_date) + " to " +  str(schedule_to_date) + ". "
    BL3 = "You will receive an email two days before your schedule expires."
    BL4 = "Please reach out to the SDC Support Team if you have any questions."
    BL5 = "\n\nThank you,\n SDC Support Team"

    body_text = (BL0 + "\r\n" + BL1 + "\n" + BL2 + "\n" + BL3 + "\n" + BL4 + BL5)
    manage_workstation_send_email(email,subject,body_text)

@app.route('/get_workstation_schedule', authorizer=authorizer, cors=cors_config)
def get_workstation_schedule():
    paramsQuery = app.current_request.query_params
    paramsString = paramsQuery['wsrequest']
    logger.setLevel("INFO")
    logging.info("Received request {}".format(paramsString))
    params = json.loads(paramsString)
    username = params['username']
    instance_id = params['instance_id']
    print(username)
    workstation_schedule = {}
    workstation_schedule['schedulelist'] = []
    dynamodb = boto3.resource('dynamodb',region_name='us-east-1')

    table = dynamodb.Table(TABLENAME_MANAGE_DISK)
    resp = table.query(
    IndexName=TABLENAME_MANAGE_DISK_INDEX,
    KeyConditionExpression=Key('username').eq(username),FilterExpression=Attr('is_active').eq(True) & Attr('instance_id').eq(instance_id))

    for item in resp['Items']:
        info = {"diskspace_instnace_id" : instance_id, "diskspace_schedule_from_date" : format_date(item['schedule_from_date']),"diskspace_schedule_to_date" : format_date(item['schedule_to_date'])}
        workstation_schedule['schedulelist'].append(info)

    table = dynamodb.Table(TABLENAME_MANAGE_USER)
    resp = table.query(
        IndexName=TABLENAME_MANAGE_USER_INDEX,
        KeyConditionExpression=Key('username').eq(username),FilterExpression=Attr('is_active').eq(True) & Attr('instance_id').eq(instance_id))

    for item in resp['Items']:
        info = {"workstation_instnace_id" : instance_id,"workstation_schedule_from_date" : format_date(item['schedule_from_date']),"workstation_schedule_to_date" : format_date(item['schedule_to_date'])}
        workstation_schedule['schedulelist'].append(info)

    table = dynamodb.Table(TABLENAME_MANAGE_UPTIME)
    resp = table.query(
        IndexName=TABLENAME_MANAGE_UPTIME_INDEX,
        KeyConditionExpression=Key('username').eq(username),FilterExpression=Attr('is_active').eq(True) & Attr('instance_id').eq(instance_id))

    for item in resp['Items']:
        info = {"uptime_instnace_id" : instance_id,"uptime_schedule_from_date" : format_date(item['schedule_from_date']),"uptime_schedule_to_date" : format_date(item['schedule_to_date'])}
        workstation_schedule['schedulelist'].append(info)
    return workstation_schedule

######

@app.route('/get_desired_instance_types', authorizer=authorizer, cors=cors_config)
def get_desired_instance_types():
    params = app.current_request.query_params
    logger.setLevel("INFO")
#########
    try:
        response=get_instances_prices(params['cpu'], params['memory'], params['os'])
        logging.info("Respnse - " + str(response))
    except BaseException as be:
        logging.exception("Error: Failed to process manage workstation request" + str(be))
        raise ChaliceViewError("Failed to process manage workstation request")

    return Response(body=response,
                    status_code=200,
                    headers={'Content-Type': 'application/json'})

def instance_family_compare_cost(famList,instances): 
    print("Recommended EC2 instances ")
    print("=====================")
    lowestCostList = []
    listIndex = -1
    prvlistIndex = -1
    for instance in instances['pricelist']:
        listIndex = listIndex + 1
        if instance['instanceFamily'] != famList:
            continue
        if prvlistIndex >= 0:
            if instances['pricelist'][prvlistIndex]['cost'] > instances['pricelist'][listIndex]['cost']:
                lowestCostList = instances['pricelist'][listIndex]
                prvlistIndex = listIndex
                continue
            if instances['pricelist'][prvlistIndex]['cost'] < instances['pricelist'][listIndex]['cost']:
                lowestCostList = instances['pricelist'][prvlistIndex]
                continue
            if instances['pricelist'][listIndex]['cost'] == instances['pricelist'][prvlistIndex]['cost']:
                str_storage=instances['pricelist'][prvlistIndex]['storage']
                if (str_storage.find('EBS') != -1):
                    lowestCostList = instances['pricelist'][prvlistIndex]
                    continue
                else:
                    lowestCostList = instances['pricelist'][listIndex]
        prvlistIndex = listIndex
    return lowestCostList
######
def get_cost_per_family(familyList,instances): 
    lowestCostList = []
    recommenedInstances = {}
    recommenedInstances['recommendedlist'] = []
    for famList in familyList:
        famList = famList.lstrip()
        famNum = 0
        listIndex = -1
        for instance in instances['pricelist']:
            if instance['instanceFamily'] != famList:
                listIndex = listIndex + 1
                continue
            famNum = famNum + 1
### one instnace and nothing to compare 
        if famNum == 1:
            lowestCostList=instances['pricelist'][listIndex]
            recommenedInstances['recommendedlist'].append(lowestCostList)
### multiple instance families found
        if famNum >= 1:
            lowestCostList=instance_family_compare_cost(famList,instances)
            recommenedInstances['recommendedlist'].append(lowestCostList)

    return recommenedInstances
    #print(json.dumps(recommenedInstances,indent=2))
       
####### function to get unique values 
def family_unique_list(tempList): 
# intilize a null list 
    unique_list = []
# traverse for all elements 
    for x in tempList:
        # check if exists in unique_list or not
        if x not in unique_list:
            unique_list.append(x)
    return unique_list

####
def get_instances_prices(cpu, memory, os):
    VCPU = cpu
    memory = memory
    MEMORY = memory + ' GiB'
    operatingSystem = os
    pricing = boto3.client('pricing')
    response = pricing.get_products(
        ServiceCode='AmazonEC2',
        Filters = [
           {'Type' :'TERM_MATCH', 'Field':'licenseModel',   'Value':'No License required'  },
           {'Type' :'TERM_MATCH', 'Field':'tenancy' ,      'Value':'Shared'       },
           {'Type' :'TERM_MATCH', 'Field':'preInstalledSw', 'Value':'NA'       },
           {'Type' :'TERM_MATCH', 'Field':'operatingSystem', 'Value':operatingSystem       },
           {'Type' :'TERM_MATCH', 'Field':'vcpu',            'Value':VCPU            },
           {'Type' :'TERM_MATCH', 'Field':'memory',          'Value':MEMORY          },
           {'Type' :'TERM_MATCH', 'Field':'location',        'Value':'US East (N. Virginia)'}
        ]
    )

    instances = {}
    instances['pricelist'] = []
    for pricelist in response['PriceList']:
        if (pricelist.find('per On Demand') == -1):
            continue
        product = json.loads(pricelist)
        productfamily = product['product']['productFamily']
        data = json.dumps(product['product'])
        attributes = json.loads(data)
        instanceFamily = attributes['attributes']['instanceFamily']
        instanceType = attributes['attributes']['instanceType']
        storage =  attributes['attributes']['storage']
        ### move up the jason string
        data = json.dumps(product['terms'])
        terms = json.loads(data)
        data = json.dumps(terms['OnDemand'])
        terms = json.loads(data)
        for key in terms:
            data = terms[key]
        data1 = json.dumps(data)
        terms = json.loads(data1)
        data = json.dumps(terms['priceDimensions'])
        terms = json.loads(data)
        for key in terms:
            data = terms[key]
        for key in terms:
            data = terms[key]
        data1 = json.dumps(data)
        terms = json.loads(data1)
        pricePerUnit=(round(float(terms['pricePerUnit']['USD']),4))
        info = {"instanceFamily" : instanceFamily,"instanceType" : instanceType,"operatingSystem" : operatingSystem,"vcpu" : VCPU, "memory" : MEMORY,"storage" : storage, "cost" : pricePerUnit}

        instances['pricelist'].append(info)

### sort by lowest cost
    familyList = []
    for instance in instances['pricelist']:
        familyList.append(str(instance['cost']) + ' : ' + instance['instanceFamily'])
    familyList.sort()
# make a unique list
    tempList = []
    for InsFamily in familyList:
        tempList.append(InsFamily.split(':')[1])

    familyList = family_unique_list(tempList)
    recommended_list=get_cost_per_family(familyList,instances)
    instance_types = []
    instance_types.append(instances)
    instance_types.append(recommended_list)
  
    return instance_types
  
