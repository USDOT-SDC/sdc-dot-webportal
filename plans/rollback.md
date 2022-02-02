# Rollback Plan

[v2.12.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.12.0)


### If rollback is required after deployment:

1. Restore web portal files from backup:
   - `aws s3 cp backup-20220203/ s3://prod-webportal-hosting-004118380849 --recursive`


2. Refresh assets on nginx proxies, using the following command:
   - `aws ssm send-command 
   --region us-east-1 
   --document-name prod-nginx-asset-update 
   --parameters staticAssetsBucket="prod-webportal-hosting-004118380849" --targets "Key=tag:Name,Values=prod-nginx-web-proxy" 
   --comment "Deploying sdc-dot-webportal to prod at $(date) and refreshing assets"`

3. Verify the website is running.


4. On the DATASETS page, open a REQUEST TO EXPORT DATA modal,and select and ACME dataset:
   - Verify that entereing '&' ';' and '#' characters in the Approval form fields cause  request submission to fail.
   - Verify that no hint messages appear for any of the Approval Form tab fields.


5. Verify that login redirects, data upload, data export, and data export approval functions are working.