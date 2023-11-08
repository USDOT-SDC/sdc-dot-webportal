# Deployment Plan

### Deployment Build Environment

- See [setup.md](setup.md)
- See [configuration.tf](../terraform/configuration.tf) for other version constraints.

__*Note:*__ Using the [win-batch-files](https://github.com/USDOT-SDC/dev-utils/tree/main/win-batch-files) can streamline this deployment process.

## Deployment Details

Add details about what sections need to be deployed.
- [ ] Deploy Terraform Root Module
- [ ] Deploy Backend (Chalice Lambda)
- [ ] Deploy Frontend (Node.js/Angular)

### Deploy Terraform Root Module

1. Pull the tag for the version to be deployed
1. Use Terraform to deploy the infrastructure-as-code
   1. Navigate to the root module directory `terraform`
   1. In Dev: Run
      ```shell
      terraform init -backend-config "bucket=dev.sdc.dot.gov.platform.terraform" -upgrade -reconfigure
      ```
   1. In Prod: Run
      ```shell
      terraform init -backend-config "bucket=prod.sdc.dot.gov.platform.terraform" -reconfigure
      ```
   1. Run
      ```shell
      terraform plan -out=tfplan_{env}_v{version}
      ```
      1. Ensure there are no changes to out of scope resources
      1. If the plan file exists, it will overwrite it  
         Change the plan file name each time you rerun `terraform plan`  
         Example: `terraform plan -out=tfplan_{env}_v{version}b`
      1. Review the plan, continue if it is correct
   1. Run
      ```shell
      terraform apply tfplan_{env}_v{version}
      ```
      1. This command uses the plan file specified  
         (it will not ask for conformation to proceed)
      1. If needed to check the plan, run
         ```shell
         terraform show tfplan_{env}_v{version}
         ```
   1. Attach tfplan files to the CRB (`tfplan_{env}_v{version}`)
   1. Execute the Test Plan to ensure the deployment was successful

### Deploy Backend (Chalice Lambda)

1. Pull the tag for the version to be deployed
   1. Navigate to the backend module directory `webportal/lambda`
   1. Run the following:
      ```shell
      pip install -r requirements.txt
      pip install -r development_requirements.txt
      python3 deploy_chalice.py --environment={env}
      ```
      If you need to delete the resources, run the following:
      ```shell
      chalice delete --stage dev-private --profile sdc
      ```
   1. Execute the Test Plan to ensure the deployment was successful

### Deploy Frontend (Node.js/Angular)

1. Pull the tag for the version to be deployed
1. Make a backup of the current webportal files
   1. Create a 'backup-<currentdate>' directory and run the following:  
      dev
      ```shell
      aws s3 cp s3://prod-webportal-hosting-004118380849  backup-{currentdate}/  --recursive
      ```
      prod
      ```shell
      aws s3 cp s3://prod-webportal-hosting-004118380849  backup-{currentdate}/  --recursive
      ```
   1. Navigate to the backend module directory `webportal/webapp`
   1. Run the following: `deploy_{env}.sh`
      - Builds the webportal files (the dist folder)
      - Moves the files into the webportal hosting s3 bucket
      - Calls the AWS Systems Manager document, prod-nginx-asset-update, which moves the files onto the prod-nginx-web-proxy servers.
   1. Execute the Test Plan to ensure the deployment was successful
