def export():
    paramsQuery = app.current_request.query_params
    paramsString = paramsQuery['message']
    logger.setLevel("INFO")
    logging.info("Received request {}".format(paramsString))
    params = json.loads(paramsString)
    bypassExportFileRequestTable = False

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

            trustedStatus = params['trustedRequest']['trustedRequestStatus']
            trustedReason = params['trustedRequest']['trustedRequestReason']

            if trustedStatus == 'Submitted' :
                bypassExportFileRequestTable = True

            if acceptableUse == 'Decline':
                trustedStatus = 'Untrusted'
                emailContent = "<br/>Trusted status has been declined to <b>" + userID + "</b> for dataset <b>" + combinedDataInfo + "</b>"
            elif trustedWorkflowStatus == 'Notify':
                trustedStatus='Trusted'
                emailContent="<br/>Trusted status has been approved to <b>" + userID + "</b> for dataset <b>" + combinedDataInfo + "</b>"
            else:
                emailContent = "<br/>Trusted status has been requested by <b>" + userID + "</b> for dataset <b>" + combinedDataInfo + "</b>"

             #send email to List of POC for Trusted Status Requests
            send_notification(listOfPOC,emailContent)    

            response = trustedUsersTable.put_item(
                Item = {
                    'UserID': userID,
                    'UserEmail': user_email,
                    'Dataset-DataProvider-Datatype': combinedDataInfo,
                    'TrustedStatus': trustedStatus,
                    'TrustedJustification': trustedReason,
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

        if not bypassExportFileRequestTable :
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
                emailContent += "<br/><br>Name: Will Sharp<br>Address: 1 Main St<br>City: Rockville<br>State: MD<br>Zipcode: 20853<br>Email: william.sharp.ctr@dot.gov"

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
            console.log("EMAIL CONTENT CHANGED")
            emailContent += "<br/><br>Name: Will Sharp<br>Address: 1 Main St<br>City: Rockville<br>State: MD<br>Zipcode: 20853<br>Email: william.sharp.ctr@dot.gov"
            send_notification(listOfPOC,emailContent)


    except BaseException as be:
        logging.exception("Error: Failed to process export request" + str(be))
        raise ChaliceViewError("Failed to process export request")

    return Response(body=response,
                    status_code=200,
                    headers={'Content-Type': 'text/plain'})

def send_notification(listOfPOC, emailContent, subject = 'HSIS Export Notification'):
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