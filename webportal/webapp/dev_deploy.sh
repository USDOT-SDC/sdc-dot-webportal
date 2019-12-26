#/bin/bash
ng build --dev --aot
#Copy everything over to S3 bucket
aws s3 cp --profile sdc ./dist s3://test-sdc-webportal-hosting --recursive --metadata-directive REPLACE --cache-control max-age=86400 --acl public-read
#Bust open the cache
aws s3 cp --profile sdc ./dist/index.html s3://test-sdc-webportal-hosting/index.html --region us-east-1 --metadata-directive REPLACE --cache-control max-age=0 --acl public-read
