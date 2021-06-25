import json
import os
import boto3

bucket_mapping = {
    os.environ.get('WYDOT_TEAM_BUCKET'): os.environ.get('WYDOT_AUTOEXPORT_BUCKET'),
    os.environ.get('SDI_TEAM_BUCKET'): os.environ.get('WAZE_AUTOEXPORT_BUCKET'),
    os.environ.get('TFHRC_TEAM_BUCKET'): os.environ.get('WAZE_AUTOEXPORT_BUCKET')
}


def retrieveExportWorkflow():
    dynamodb_client = boto3.resource('dynamodb')
    table = dynamodb_client.Table(os.environ.get('DYNAMODB_AVAILABLE_DATASET'))
    availableDatasets = table.scan(TableName=os.environ.get('DYNAMODB_AVAILABLE_DATASET'))['Items']
    exportWorkflow = {}
    for dataset in availableDatasets:
        if 'exportWorkflow' in dataset:
            if 'CVP' in dataset['exportWorkflow']:
                exportWorkflow.update(dataset['exportWorkflow']['CVP'])
            if 'WAZE' in dataset['exportWorkflow']:
                exportWorkflow.update(dataset['exportWorkflow']['WAZE'])
    return exportWorkflow


def notifyPOC(listOfPOC, emailContent):
    ses_client = boto3.client('ses', region_name='us-east-1')
    sender = os.environ.get('EMAIL_SENDER')

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
                    'Data': 'Auto-Export Notification',
                },
            },
            Source=sender
        )
    except BaseException as ke:
        print("Failed to send notification " + str(ke))
        raise ke

    print('SUCCEEDED SENDING EMAIL')


def lambda_handler(event, context):
    s3_client = boto3.client('s3')

    source_bucket = json.loads(event['Records'][0]['Sns']['Message'])['Records'][0]['s3']['bucket']['name']
    source_key = json.loads(event['Records'][0]['Sns']['Message'])['Records'][0]['s3']['object']['key']

    if source_key[-1] == '/':
        print('IGNORING FILE BECAUSE IT IS A FOLDER')
        return

    print('Copy From: ' + source_bucket + '/' + source_key)
    print('Copy To: ' + bucket_mapping[source_bucket] + '/' + source_key[12:])

    if bucket_mapping.get(source_bucket) == None:
        print(f'No bucket mapping found for {source_bucket}, returning')
        return

    try:
        s3_client.copy_object(
            Bucket=bucket_mapping[source_bucket],
            CopySource={'Bucket': source_bucket, 'Key': source_key},
            Key=source_key[12:],
            ServerSideEncryption='AES256'
        )
    except Exception as e:
        print('FAILED COPY')
        raise e

    print('SUCCEEDED COPY')

    exportWorflow = retrieveExportWorkflow()

    # This needs to eventually become less hardcoded but for now WYDOT is the only DP supported
    listOfPOC = {os.environ.get('WYDOT_AUTOEXPORT_BUCKET'):exportWorflow['WYDOT']['ListOfPOC'], os.environ.get('WAZE_AUTOEXPORT_BUCKET'):exportWorflow['WAZE']['ListOfPOC']}

    emailContent = '<br/>Hello,<br/><br/>A file named <b>' + source_key.split('/')[-1] + '</b> of derived datatype <b>' + source_key.split('/')[1] + '</b> ' \
        'was just exported automatically from your team\'s S3 bucket, <b>' + source_bucket + '</b>. ' \
        'The file was exported to your team\'s auto-export S3 bucket, <b>' + \
        bucket_mapping[source_bucket] + '</b>. ' \
        'If you would like to view the content of this file, please locate the file within the bucket at ' \
        '<b>s3://' + bucket_mapping[source_bucket] + '/' + source_key[12:] + '</b>.<br/><br/>Thank You,<br/>SDC Team'

    notifyPOC(listOfPOC[bucket_mapping[source_bucket]], emailContent)