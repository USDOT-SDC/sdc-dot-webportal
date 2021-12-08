#Rollback Plan

[v2.9.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.9.0)

###Before deployment:

1. Make a backup of webportal files
   1. Within build machine, make an html directory and run the following:
     `aws s3 cp s3://prod-webportal-hosting-004118380849 html/ --recursive`
   

###If rollback is required after deployment:

1. Restore web portal files from backup:
   - `aws s3 cp html/ s3://prod-webportal-hosting-004118380849 --recursive`

2. Refresh assets on nginx proxies:
   - `echo "Refreshing assets on proxies..."
   aws ssm send-command --region us-east-1 \
     --document-name prod-nginx-asset-update \
     --parameters staticAssetsBucket="prod-webportal-hosting-004118380849" \
     --targets "Key=tag:Name,Values=prod-nginx-web-proxy" \
     --comment "Deploying sdc-dot-webportal to prod at $(date) and refreshing assets"`
3. Verify the website is running.

4. On DataSets page:

   - Verify that the Data Export Form/Approval Form tabrequests 8 fields of data, including  “High Level Description of Derived Dataset”.

   - Verify that description under Data Export Form/Trusted Status tab reads as follows:
     - Trusted Status is a mechanism for analysts to obtain a passport from a data provider. Obtaining this passport allows analyst to export their data immediately (for subsequent similar requests), as opposed to waiting for the review and approval of a data provider.
         This status is acquired per Project + Data Provider + Sub-Dataset/Data Type.

5. Verify that data upload, data export, and data export approval functions are working.