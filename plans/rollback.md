# Rollback Plan

[v2.10.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.10.0)


### If rollback is required after deployment:

1. Restore web portal files from backup:
   - `aws s3 cp html/ s3://prod-webportal-hosting-004118380849 --recursive`


2. Refresh assets on nginx proxies, using the following command:
   - `aws ssm send-command --region us-east-1 
     --document-name prod-nginx-asset-update 
     --parameters staticAssetsBucket="prod-webportal-hosting-004118380849" 
     --targets "Key=tag:Name,Values=prod-nginx-web-proxy" 
     --comment "Deploying sdc-dot-webportal to prod at $(date) and refreshing assets`
   

3. Verify the website is running.  Do we need to build and serve the website.


4. On DataSets page:
   - Verify that the Data Export Form/Approval Form inspects to 700px wide and 630px high.
   - Verify that no tab on the Data Export Form renders to include a 'Previous' button.
   - Verify that the Trusted Status description reads:
     - "Trusted Status is a mechanism to help speed the turnaround of future, similar export requests. Obtaining Trusted Status eliminates the Data Provider review/approval requirements for subsequent, similar requests - and will enable immediate export of data, at the time of your request.  A separate Trusted Status should be acquired, depending on each specific combination of Project, Data Provider, and Sub-Data Set/Data Type requested for export."


5. Verify that login redirects, data upload, data export, and data export approval functions are working.