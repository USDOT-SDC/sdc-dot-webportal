# Rollback Plan

[v2.13.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.13.0)


### If rollback is required after deployment:

1. Restore web portal files from backup:
   - `aws s3 cp backup-20220428/ s3://prod-webportal-hosting-004118380849 --recursive`


2. Refresh assets on nginx proxies, using the following command:
   - `aws ssm send-command 
   --region us-east-1 
   --document-name prod-nginx-asset-update 
   --parameters staticAssetsBucket="prod-webportal-hosting-004118380849" --targets "Key=tag:Name,Values=prod-nginx-web-proxy" 
   --comment "Deploying sdc-dot-webportal to prod at $(date) and refreshing assets"`

3. Verify the website is running.


4. On the DATASETS page verify that no "Request Trusted User Status" button appears below the datasets table.


5.  On the DATASETS page, open a REQUEST TO EXPORT DATA modal, and select any non-trusted ACME dataset:
   - Verify that the Trusted Status tab appears and that all tabs render the same as  pre-release screenshots.
   - Repeat the above two steps for any trusted ACME dataset..

6.  On the EXPORT REQUESTS page, ensure that no Justification column exists in the Trusted Requests table.


7. Submit data export requests for both trusted and non-trusted datasets.
   -Verify for each that confirmation emails are received and that data loads to the EXPORT REQUESTS page as expected.
   -Approve or reject each request and ensure that additional confirmation emails are received.


8. Verify that login redirects, data upload, data export, and data export approval functions are working.