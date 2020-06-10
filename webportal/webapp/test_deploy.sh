#/bin/bash

echo "***"
echo "Building assets..."
ng build --configuration=test-private


# Use distinct test-private bucket so we can modify URLs, etc. per the environment
# Copy everything over to S3 bucket
echo "Copying to s3..."
aws s3 cp --profile sdc ./dist s3://test-private-sdc-webportal-hosting --recursive --only-show-errors

# Refresh assets on nginx proxies
echo "Refreshing assets on proxies..."
aws ssm send-command --profile sdc \
  --document-name test-nginx-asset-update \
  --parameters staticAssetsBucket="test-private-sdc-webportal-hosting" \
  --targets "Key=tag:Name,Values=test-nginx-web-proxy" \
  --comment "Deploying sdc-dot-webportal to test at $(date) and refreshing assets"
