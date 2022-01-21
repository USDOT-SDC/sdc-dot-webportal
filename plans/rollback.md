# Rollback Plan

[v2.11.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.11.0)


### If rollback is required after deployment:

1. Restore web portal files from backup:
   - `aws s3 cp html/ s3://prod-webportal-hosting-004118380849 --recursive`


2. Refresh assets on nginx proxies, using the following command:
   - `aws ssm send-command 
   --region us-east-1 
   --document-name prod-nginx-asset-update 
   --parameters staticAssetsBucket="prod-webportal-hosting-004118380849" --targets "Key=tag:Name,Values=prod-nginx-web-proxy" 
   --comment "Deploying sdc-dot-webportal to prod at $(date) and refreshing assets"`

3. Verify the website is running.


4. On REGISTER/LOGIN page:
   - Verify that no 'external link' icon appears to the right of the Access Request Form link.
   - Verify that the Access Request Form link opens 'https:// beta-portal-sdc.dot.gov/assets/SDC_Form/SDCAccessRequestForm' in a seperate tab.
   - Verify that the paragraph under SIGN UP heading reads:
     - "Please download the access request form below, fill out the required details and send an email to sdc-support@dot.gov. Once approved, we will send you an email with the instructions for accessing the platform."


5. Verify that login redirects, data upload, data export, and data export approval functions are working.