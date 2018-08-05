import boto3
import logging


def lambda_handler(event, context):
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    s3_object_key = event["Records"][0]["s3"]["object"]["key"]
    s3 = boto3.resource('s3')
    logger = logging.getLogger()
    logger.setLevel("INFO")
    response = s3.meta.client.get_object(Bucket=bucket_name, Key=s3_object_key)
    if response["Metadata"]:
        logger.info("This object has been uploaded from web portal")
    else:
        s3_object = s3.Object(bucket_name, s3_object_key)
        s3_object.metadata.update({'download':'false','export':'true','publish':'false'})
        s3_object.copy_from(CopySource={'Bucket': bucket_name, 'Key': s3_object_key}, Metadata=s3_object.metadata, MetadataDirective='REPLACE')
        logger.info("Adding metadata to S3 object has been completed successfully")
