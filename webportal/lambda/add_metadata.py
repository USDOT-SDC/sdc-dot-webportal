import boto3
import logging
import os
from urllib.parse import unquote_plus


def lambda_handler(event, context):
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    s3_object_key = event["Records"][0]["s3"]["object"]["key"]
    #add_metadata = 0
    print("S3 object key:"+s3_object_key)
    logger = logging.getLogger()
    logger.setLevel("INFO")
    s3_object_key = unquote_plus(s3_object_key)
    logger.info("EVENT:"+str(s3_object_key))
    name_of_export_requests_folder = os.environ["EXPORT_REQUEST_FOLDER"]
    extensions = os.environ["FILE_EXTENSIONS"].split(",")
    #for extension in extensions:
    #    if extension in s3_object_key:
    #        add_metadata = 1
    #print(add_metadata)
    #if name_of_export_requests_folder in s3_object_key and add_metadata:
    if name_of_export_requests_folder in s3_object_key:    
        s3 = boto3.resource('s3')
        response = s3.meta.client.get_object(Bucket=bucket_name, Key=s3_object_key)
        if response["Metadata"]:
            if "download" in response["Metadata"]:
                logger.info("This object has been uploaded from web portal")
            else:
                s3_object = s3.Object(bucket_name, s3_object_key)
                s3_object.metadata.update({'download':'false','export':'true','publish':'false'})
                s3_object.copy_from(CopySource={'Bucket': bucket_name, 'Key': s3_object_key}, Metadata=s3_object.metadata, MetadataDirective='REPLACE')
                logger.info("Adding metadata to S3 object has been completed successfully")
        else:
            s3_object = s3.Object(bucket_name, s3_object_key)
            s3_object.metadata.update({'download':'false','export':'true','publish':'false'})
            s3_object.copy_from(CopySource={'Bucket': bucket_name, 'Key': s3_object_key}, Metadata=s3_object.metadata, MetadataDirective='REPLACE')
            logger.info("Adding metadata to S3 object has been completed successfully")
    else:
        logger.info("Ignored this file with key:"+s3_object_key)
    
    #storage_gateway = boto3.client('storagegateway')
    #share=os.environ["SHARE"].split(',')

    #for sh in share:
     #   print('refresh cache attempt on {}'.format(sh))
      #  status = storage_gateway.refresh_cache(FileShareARN = 'arn:aws:storagegateway:us-east-1:911061262852:share/'+sh)

        