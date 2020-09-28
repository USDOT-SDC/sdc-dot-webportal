zip -g add_metadata.zip ./add_metadata.py

# Push zipped files up to S3
aws s3 cp add_metadata.zip s3://prod-lambda-bucket-004118380849/sdc-dot-webportal/add_metadata.zip --region us-east-1