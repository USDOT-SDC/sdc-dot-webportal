# Deployment Plan

[v2.9.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.9.0)


### Pre-Deployment:
1. Merge open PR into master
2. Enable test data sets on PROD, so they’re available for export as part of post-release test plan.
  

### Deployment Plan:
1. Under webportal\webapp run `ecs_prod_deploy.sh`
   - Builds the webportal files (the dist folder)
   - Moves the files into the webportal hosting s3 bucket
   - Calls the AWS Systems Manager document, prod-nginx-asset-update, which moves the files onto the prod-nginx-web-proxy servers.