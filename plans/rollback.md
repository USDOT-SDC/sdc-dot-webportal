# Rollback Plan

[v2.15.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.15.0)


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


4. On the DATASETS page verify that no "My Edge Database"panel/ no "Request Table Export to Edge DB" button appears below the "My Datasets/Algorithm" panel


5. On the EXPORT REQUESTS page, ensure that no 'Table Export Requests' table appears between the 'File Export' and 'Trusted Requests' tables.


6. Verify that login redirects, data upload, data export(for both trusted and non-trusted datasets), and data export approval functions are working.