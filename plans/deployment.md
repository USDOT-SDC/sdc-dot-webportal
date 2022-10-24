# Deployment Plan

[v2.15.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.15.0)


### Pre-Deployment - General Tasks:
1. Merge open PR into master.
2. Reset the 2.15.0 tag in the remote repo, deleting from (development) branch and adding to main.
3. On  PROD webportal, ensure a minimum of 10 files, including a 2GB and 2MB sized files, are available for data export so they’re available for export as part of post-release testing.
4. On PROD webportal, capture a screenshot of 'Export File Requests' table.
5. On PROD webportal, ensure there is at least one ACME dataset for which Trusted Status is already approved and  that there are one or more ACME datasets which hold non-Trusted Status.
6. Coordinate with Waze Data Steward to enable testing of dummy Waze export request immediately after release
7. Confirm tags for prod nginx-proxy match those in the deploy commands. If different make note and correct prod-deploy ssm move command to reflect correct tag and value.


### Pre-Deployment - Ready the Build Environment:
1. Verify/Install the Deployment Build Environment:
   1. Windows or Linux
   2. AWS CLI [version 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
   3. Node.js  [14.17.6](https://nodejs.org/download/release/v14.17.6/)
      1. If installation is required, check the box to install the necessary tools, at the Tools for Native Modules step.
   4. npm [8.1.4](https://www.npmjs.com/package/npm) (included with NodeJS/Chocolatey installation)
   5. Python [3.9.9](https://www.python.org/downloads/release/python-399/) (included with NodeJS/Chocolatey installation)
   6. Angular CLI [6.0.8](https://angular.io/cli)  /  Angular 5.2.1 (npm install)
   7. For additional information on needed installs and dependencies, refer to [README.md](https://github.com/USDOT-SDC/sdc-dot-webportal#installation-steps-for-ui-first-time-build--).
   
   
2. Make a backup of the current webportal files
   1. Within build machine, create a 'backup-20221021' directory and run the following:
     `aws s3 cp s3://prod-webportal-hosting-004118380849 backup-20221021/ --recursive`
   
      
### Deployment Plan for v2.15.0:
1. On the deployment machine, pull/clone the sdc-do-webportal repo at tag 2.15.0


2. Navigate to the webportal\webapp folder, within the repo directory, and run `ecs_prod_deploy.sh`.
   - Builds the webportal files (the dist folder)
   - Moves the files into the webportal hosting s3 bucket
   - Calls the AWS Systems Manager document, prod-nginx-asset-update, which moves the files onto the prod-nginx-web-proxy servers.


3. Verify the web portal s3 bucket now lists data from the previous date of deployment. 
