zip -g add_metadata.zip ./add_metadata.py
zip -g auto_export_lambda.zip ./auto_export_lambda.py

# Push zipped files up to S3
aws s3 cp add_metadata.zip s3://prod-lambda-bucket-004118380849/sdc-dot-webportal/add_metadata.zip --region us-east-1
aws s3 cp auto_export_lambda.zip s3://prod-lambda-bucket-004118380849/sdc-dot-webportal/auto_export_lambda.zip --region us-east-1