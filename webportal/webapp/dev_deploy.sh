#/bin/bash
ng build --aot=true --configuration=dev-private
# Use distinct dev-private bucket so we can modify URLs, etc. per the environment
#Copy everything over to S3 bucket
aws s3 cp --profile sdc ./dist s3://dev-private-sdc-webportal-hosting --recursive

# Bust open the cache
# This won't work for proxy, we would need to trigger a re-fetch somehow
#    - maybe invoke an SSM command to grab latest on our proxies?
# aws s3 cp --profile sdc ./dist/index.html s3://test-sdc-webportal-hosting/index.html --region us-east-1 --metadata-directive REPLACE --cache-control max-age=0 --acl public-read
