
# SDC-DOT Webportal README


## Installation steps for UI first-time build -

##### Goto ../webapp/ folder and run the command below -
1. Install Nodejs
   * curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
   * sudo apt-get install -y nodejs

2. Install NPM:-
   * sudo npm install -g npm
   * Install Angular CLI `sudo npm i -g @angular/cli@latest`
   * Install TSLint `sudo npm install -g tslint typescript`
   * Install Protractor for e2e testing `sudo npm install -g protractor`
   * `sudo npm i -g typings`
   * Install Node modules library `npm i`

3. Run local build
   * ../webportal/webapp$  `ng serve`
   * open `http://localhost:4200`
   
   
## Configuration UI changes

```sh 
NOTE - Do not check in configuration value into project repository for the security purpose
```

1. Cognito configuration
    * cd ../webapp/src/services
    * open `cognito.service.ts` service file
    * Add below configuration value
        - _REGION - User pool AWS region
        - _USER_POOL_ID - User pool ID
        - _CLIENT_ID - App client ID
        - _IDENTITY_PROVIDER - User pool Identity provider name
        - _APP_DOMAIN - App domain name
        - _REDIRECT_URL - Re-direct URL for the user pool
        
2. API Gateway configuration
     * cd ../webapp/src/services
     * open `apigateway.service.ts` service file 
     * Add AWS API gateway base endpoint in the below variable
        - _API_ENDPOINT    
       
        

## Deployment steps for the application UI

   
```sh 
NOTE - Change s3 bucket hosting name e.x. s3://<bucket_name> in deployment script 
```  

1. Run the command below for Development Deployment -
   * Goto `../webapp/`
   * Run `./dev_deploy.sh`
    
2. Run the command below for Production Deployment -
   * Goto `../webapp/`
   * Run `./prod_deploy.sh` 
 
## Deploy Backend

### Pre-requiste

    To deploy backend you need to install [Chalice](https://github.com/aws/chalice)

### Deployment Steps

#### Modify the variable values

Once Chalice framework installed modify the following varibale value in app.py file (location: webportal/lambda/app.py)

| **Variables**                   | **Description**                                              |
| ------------------------------- | ------------------------------------------------------------ |
| TABLENAME                       | AWS DynamoDB Tablename for fetching user-stack mapping       |
| TABLENAME_DATASET               | AWS DynamoDB Tablename for fetching Available dataset        |
| APPSTREAM_S3_BUCKET_NAME        | AWS S3 bucket name used by AWS AppStream                     |
| RECEIVER                        | The support email where admin will receive all request email |
| PROVIDER_ARNS                   | ARN of AWS Cognito User Pool                                 |
| RESTAPIID                       | RestAPI ID of API Gateway                                    |
| AUTHORIZERID                    | Respective Authorizer ID of RestAPI ID provided above        |


#### Deploy the Backend

To deploy run below command:

```sh
chalice deploy --stage <stage_name> --no-autogen-policy --profile us-dot
```

where, stage_name can be dev, prod and so on.
