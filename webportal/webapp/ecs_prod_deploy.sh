#/bin/bash

echo "***"
echo "Building assets..."
ng build --configuration=ecs-prod


# Copy everything over to S3 bucket
echo "Copying to s3..."
aws s3 cp ./dist s3://prod-webportal-hosting-004118380849 --recursive --only-show-errors

# Refresh assets on nginx proxies
echo "Refreshing assets on proxies..."
aws ssm send-command --region us-east-1 \
  --document-name prod-nginx-asset-update \
  --parameters staticAssetsBucket="prod-webportal-hosting-004118380849" \
  --targets "Key=tag:Name,Values=prod-nginx-web-proxy" \
  --comment "Deploying sdc-dot-webportal to prod at $(date) and refreshing assets"