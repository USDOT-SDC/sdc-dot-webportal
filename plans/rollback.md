# Rollback Plan

[v3.0.1](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/3.0.1)

### If rollback is required after deployment:

1. Restore web portal files from backup:

   - `aws s3 cp backup-<releasedate>/ s3://prod-webportal-hosting-004118380849 --recursive`

2. Refresh assets on nginx proxies, using the following command:

   - `aws ssm send-command 
--region us-east-1 
--document-name prod-nginx-asset-update 
--parameters staticAssetsBucket="prod-webportal-hosting-004118380849" --targets "Key=tag:Name,Values=prod-nginx-web-proxy" 
--comment "Deploying sdc-dot-webportal to prod at $(date) and refreshing assets"`

3. Verify the website is running.

4. On the FAQ page verify that no "Helpful LInks" section appears above the FAQ section.

5. Also verify pre-deploy FAQ images and content exist.

6. Verify that login redirects, data upload, data export(for both trusted and non-trusted datasets), and data export approval functions are working.
