#/bin/bash

# Previous prod deploy
# ng build --aot=true --prod=true
#Copy everything over to S3 bucket
# aws s3 cp --profile sdc ./dist s3://prod-sdc-webportal-hosting --recursive --metadata-directive REPLACE --cache-control max-age=86400 --acl public-read
#Bust open the cache
# aws s3 cp --profile sdc ./dist/index.html s3://prod-sdc-webportal-hosting/index.html --region us-east-1 --metadata-directive REPLACE --cache-control max-age=0 --acl public-read


echo "***"
echo "Building assets..."
ng build --configuration=production-private


# Use distinct dev-private bucket so we can modify URLs, etc. per the environment
# Copy everything over to S3 bucket
echo "Copying to s3..."
aws s3 cp --profile sdc ./dist s3://prod-private-sdc-webportal-hosting --recursive --only-show-errors

# Refresh assets on nginx proxies
echo "Refreshing assets on proxies..."
aws ssm send-command --profile sdc \
  --document-name prod-nginx-asset-update \
  --parameters staticAssetsBucket="prod-private-sdc-webportal-hosting" \
  --targets "Key=tag:Name,Values=prod-nginx-web-proxy" \
  --comment "Deploying sdc-dot-webportal to PROD at $(date) and refreshing assets"