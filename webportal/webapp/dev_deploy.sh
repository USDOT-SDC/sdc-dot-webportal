#/bin/bash

echo "***"
echo "Building assets..."
ng build --aot=true --configuration=dev-private


# Use distinct dev-private bucket so we can modify URLs, etc. per the environment
# Copy everything over to S3 bucket
echo "Copying to s3..."
aws s3 cp --profile sdc ./dist s3://dev-private-sdc-webportal-hosting --recursive --only-show-errors

# Refresh assets on nginx proxies
echo "Refreshing assets on proxies..."
aws ssm send-command --profile sdc \
  --document-name dev-nginx-asset-update \
  --parameters staticAssetsBucket="dev-private-sdc-webportal-hosting" \
  --targets "Key=tag:Name,Values=dev-nginx-web-proxy" \
  --comment "Deploying sdc-dot-webportal to dev at $(date) and refreshing assets"