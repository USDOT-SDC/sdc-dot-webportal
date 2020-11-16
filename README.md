[![Build Status](https://travis-ci.com/usdot-jpo-sdc/sdc-dot-webportal.svg?branch=develop)](https://travis-ci.com/usdot-jpo-sdc/sdc-dot-webportal)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=usdot-jpo-sdc_sdc-dot-webportal&metric=alert_status)](https://sonarcloud.io/dashboard?id=usdot-jpo-sdc_sdc-dot-webportal)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=usdot-jpo-sdc_sdc-dot-webportal&metric=coverage)](https://sonarcloud.io/dashboard?id=usdot-jpo-sdc_sdc-dot-webportal)

# sdc-dot-webportal
The Secure Data Commons is an online data warehousing and analysis platform for transportation researchers. On this portal, researchers can take advantage of pre-established programming environments to access and analyze a growing set of transportation-related data sets.
The SDC platform provides a collaborative environment for traffic engineers, researchers, data scientists and anyone who is interested in carrying out research and analysis on different datasets related to traffic, weather, crashes, and others.

## Table of Contents

[I. Release Notes](#release-notes)

[II. Usage Example](#usage-example)

[III. Configuration](#configuration)

[IV. Installation](#installation)

[V. Design and Architecture](#design-architecture)

[VI. Unit Tests](#unit-tests)

[VII.  File Manifest](#file-manifest)

[VIII.  Development Setup](#development-setup)

[IX.  Release History](#release-history)

[X. Contact Information](#contact-information)

[XI. Contributing](#contributing)

[XII. Known Bugs](#known-bugs)

[XIII. Credits and Acknowledgment](#credits-and-acknowledgement)

[XIV.  CODE.GOV Registration Info](#code-gov-registration-info)

[XV.  Code Quality Monitor](#code-quality-monitor)

---

<!---                           -->
<!---     Release Notes         -->
<!---                           -->

<a name="release-notes"/>

## I. Release Notes
**August 21, 2020. SDC sdc-dot-webportal Release 2.7**
### What's New in Release 2.7
* Change SDC support email address from support@securedatacommons.com to sdc-support@dot.gov

**August 7, 2020. SDC sdc-dot-webportal Release 2.6.1**
### What's New in Release 2.6.1
* PDF for SDC Access Request Form updated to v2
* The words "Data Definition" have been removed from the information titles for the projects
* The workstation resizing bug has been fixed with providing ARM workstations as possible choices
* A notification is shown before uploading data to the SDC to inform the user no PII or CBI data is allowed to be uploaded

**July 7, 2020. SDC sdc-dot-webportal Release 2.6**
### What's New in Release 2.6
* Change URL for the Secure Data Commons Webportal from portal.securedatacommons.com to portal.sdc.dot.gov
* Create a redirect for traffic from securedatacommons.com to sdc.dot.gov
* Enable PIV log-in for DOT users

**April 7, 2020. SDC sdc-dot-webportal Release 2.5**
### What's New in Release 2.5
* Add Auto-Export request option for users with trusted status in the export request pop-up window
* Add Auto-Export request approving menu for data providers in the export requests tab
** Includes justification provided by Data Analyst

**April 4, 2020. SDC sdc-dot-webportal Release 2.4.1**
### What's New in Release 2.4.1
* Inject the Cognito user pool through the environment so all environments do not need to use the dev Cognito pool

**January 28, 2020. SDC sdc-dot-webportal Release 2.4**
### What's New in Release 2.4
* Change login functionality to allow users to be redirected to Login.gov
* Add syncing screen after login from Login.gov so users can sync their Login.gov account with their SDC account

**November 11, 2019. SDC sdc-dot-webportal Release 2.3**
### What's New in Release 2.3
* Bug fix for export functionality

**November 1, 2019. SDC sdc-dot-webportal Release 2.2**
### What's New in Release 2.2
* Provides a new feature for users to modify their workstation to a different configuration on-demand
* Provides a new feature for users to schedule workstation uptime, so users can continue to keep their workstations running without being stopped by the nightly process

**August 8, 2019. SDC sdc-dot-webportal Release 2.1**
### What's New in Release 2.1:
- Enabled HTTP Strict Transport Security (HSTS) policy to ensure data is encrypted before it is sent, making it impossible for attackers to read or modify the data in transit to the authenticated server. HSTS protects against HTTP downgrade attacks (SSL stripping attacks) by requiring all traffic to use HTTPS, and rewrites requests that do not point to encrypted sources.

<!---                           -->
<!---     Usage Example         -->
<!---                           -->

<a name="usage-example"/>

## II. Usage Example

This is an online data warehousing and analysis platform, which provides a collaborative environment for traffic engineers, researchers, data scientists and anyone who is interested in carrying out research and analysis on different datasets related to traffic, weather, crashes, and others.

**[1. Onboarding process for users to the SDC system](#onboarding-users)**
Onboarding a user to the SDC system involves the following steps:

**Step 1- User Request**

User requests access to the SDC system via submitting the required information on the access request form. User access request forms will be stored for the duration of the contract.

**Step 2 – Access Request Review**

After reviewing the request, SDC Support Team will:
Creates a user name and password for the user within 24 hours of the request.
Provision a standard workstation based on the user preferences (unless unique tools are requested by the user - see Step 5 for details).
Provision any back-end services (such as S3 buckets) needed.

**Step 3 – Email Instructions**

SDC support team will send out an email to the user with the login instructions. Included with the login instructions are the following:
Basic instructions on getting started with the SDC (username, temporary login password, and link to the log-in page)
Instructions for scheduling a phone/webinar walkthrough of the system.
Contacts for troubleshooting.

**Step 4 – Walkthrough of the System**

The SDC support team will offer two walkthrough meetings with the user:
Orientation - An optional orientation web-meeting is available to provide a high-level overview of the SDC system. About 15-30 minutes in duration, the SDC Support Team will demonstrate the SDC system including:
How to set up workstations?
How to request data set access?
How to bring your own data and code into the SDC, using upload features and code repositories like GitHub?
How to publish results of the research to other users of the SDC?
How to use sample material and scripts in the SDC?
Technical Session - Once a user is familiar with the layout of the SDC system and is ready to access data, the SDC Support Team will conduct a technical session to demonstrate how the user can start analyzing the requested dataset. This technical session, about 30-60 minutes in length, will include the following:
How to access the data that has been made available?
What tools/scripts are available for this dataset?
What additional information about the dataset is available?
What are the restrictions of the dataset?

**Step 5 – Non-Standard Workstation Access**

If the user requires specialized tools, programming capabilities, or operating systems that are not offered by the standard SDC workstations, the SDC Support Team will investigate the following:
Availability of the requested tool/programming capability (open-source versus licensed).
If open-source, what are the required dependencies for the tool and can it be installed on the SDC system?
If licensed software, the user is responsible for providing a license. The SDC team will walk through how best to install the licensed software to the user’s workstation.
Once a determination is made on whether the user’s needs can be supported within the SDC system, the SDC support team will communicate directly with the user notifying them of the ability/inability to provide the requested workstation tools. This will occur prior to the walkthrough and immediately after the user submits the access form. Ideally, the SDC team will work with the user to determine acceptable alternatives to the user. Once an alternative has been selected, the SDC support team will provision the workstation according to the agreed-upon specifications.

**Step 6 – Check-in**

Once the walkthrough of the system is complete, the SDC Support Team will check-in with the user (via email) within a week of the technical session to ensure that their use of the SDC system is going smoothly. In the email, the user will be pointed to available resources and an email point of contact for additional needs from the SDC Support Team

**[2. SDC Datasets](#sdc-datasets)**

There are three types of datasets in SDC:

**1. Raw datasets**
The data stored in its native or original format are referred to as raw datasets. These datasets could be in structured (such as databases, logs, or financial data), semi-structured (HTML, XML, RDF, CSV) and un-structured (images, PDF, Word documents). This data is unaltered and stored as-is. The data can be received through continuous streaming sources (APIs, sensors) or one-time load from external sources.

**2. Curated datasets**
Data curation is a process of integrating the raw data collected from various sources, annotating the data and presenting it in such a way that the value of the data is maintained over time and the data remains available for reuse and preservation. Curated datasets enable data discovery and retrieval, maintain quality, add value and provide for re-use over time, for researchers and data scientists. The curation process includes data transformations from unstructured and semi-structured formats to a structured format, deduplication of data, data obfuscation, and data cleaning, providing high-quality data for researchers to create meaningful insights.

**3. Published datasets**
Published datasets are created by researchers to disseminate their research for other users to verify and reuse them beyond the original purpose for which they were collected. Published datasets are a result of combining analysis on curated datasets available in SDC platform along with other datasets or algorithms that is owned/created by a researcher or data scientist.

### Accessing portal

[sdc-dot-webportal](https://portal.securedatacommons.com/)

<!---                           -->
<!---     Configuration         -->
<!---                           -->

<a name="configuration"/>

## III. Configuration


<!---                           -->
<!---     Installation          -->
<!---                           -->

<a name="installation"/>

## IV. Installation

You can install dependencies for the web app via:
```sh
# pwd: /webportal/webapp
npm install
```

<!---                                 -->
<!---     Design and Architecture     -->
<!---                                 -->

<a name="design-architecture"/>

## V. Design and Architecture


<!---                           -->
<!---     Unit Tests          -->
<!---                           -->

<a name="unit-tests"/>

## VI. Unit Tests

You can run unit tests using the following command in the project root directory:

```sh
coverage run -m pytest
```



<!---                           -->
<!---     File Manifest         -->
<!---                           -->

<a name="file-manifest"/>

## VII. File Manifest


<!---                           -->
<!---     Development Setup     -->
<!---                           -->

<a name="development-setup"/>

## VIII. Development Setup

The following instructions describe the procedure to build and deploy the webportal.

### Deploying pre-requisite infrastructure

We are using terraform to create some of the base infrastructure for webportal. Here are the steps for creating the infrastructure:
```sh
# Initialize the backend
# If you are switching environments, do NOT overwrite the existing state! (enter "no" when prompted)

# pwd: /terraform
terraform init -backend-config=config/backend-dev.conf 
```

Apply the changes:
```sh
# pwd: /terraform
terraform apply -var-file="config/dev.tfvars"
```

See [ECS_MIGRATION.md](ECS_MIGRATION.md) for specifics on how this applies when moving into ECS.

### Deploy the Backend -

To deploy run below command at the lambda folder:

```sh
. ./setup_venv.sh # Note space between the 2 periods
python3 deploy.py --environment <whatever>
```

where, `--environment` can be `dev`, `prod` and so on.

### Deleting the Backend

If you need to delete your resources, do the following:
```sh
# pwd: /webportal/lambda
chalice delete --stage dev-private --profile sdc
```

##### Deploy the metadata lambda function - 

**Step 1**: Create a script with below contents e.g(sdc-add-metadata-to-s3-object
.sh)
```#!/bin/sh

cd sdc-dot-webportal/webportal/lambda
zipFileName="sdc-add-metadata-to-s3-object.zip"

zip -r9 $zipFileName add_metadata.py
```

**Step 2**: Change the permission of the script file

```
chmod u+x sdc-add-metadata-to-s3-object.sh
```

**Step 3** Run the script file
./sdc-add-metadata-to-s3-object.sh

**Step 4**: Upload the sdc-add-metadata-to-s3-object.zip generated from Step 3 to a lambda function via aws console.

**Step 5**: Attach a DataProcessingRole to this lambda function from the AWS console

**Step 6**: Add S3 bucket triggers ObjectCreatedByPut and ObjectCreatedByCompleteMultipartUpload to this lambda function for all the team buckets.

### Installation steps for UI first-time build -

##### Goto ../webapp/ folder and run the command below -
1. Install Nodejs
   * curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
   * sudo apt-get install -y nodejs

2. Install NPM:-
   * sudo npm install -g npm
   * Install Angular CLI `sudo npm install -g @angular/cli@1.7.4`
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

Cognito configuration
* cd ../webapp/src/environments
* open `environment.ts` service file
* Add below configuration value
    - production - Boolean value for the type of environment
    - REGION - User pool AWS region
    - USER_POOL_ID - User pool ID
    - CLIENT_ID - App client ID
    - IDENTITY_PROVIDER - User pool Identity provider name
    - APP_DOMAIN - App domain name
    - REDIRECT_URL - Re-direct URL for the user pool
    - API_ENDPOINT - URL for the API endpoint

## Deployment steps for the application UI

1. Run the command below for Development Deployment:
   * `cd` into `webportal/webapp/`
   * Run `./ecs_dev_deploy.sh`

2. Run the command below for Production Deployment:
   * `cd` into `webportal/webapp/`
   * Run `./ecs_prod_deploy.sh`

### Prerequisites
* Your environment.ts file must be fully filled out with the required environment variables before you can deploy to any environment

<!---                           -->
<!---     Release History       -->
<!---                           -->

<a name="release-history"/>

## IX. Release History

August 8, 2019. SDC sdc-dot-webportal Release 2.1


<!---                             -->
<!---     Contact Information     -->
<!---                             -->

<a name="contact-information"/>

## X. Contact Information

For any queries you can reach to sdc-support@dot.gov


<!---                           -->
<!---     Contributing          -->
<!---                           -->

<a name="contributing"/>

## XI. Contributing


<!---                           -->
<!---     Known Bugs            -->
<!---                           -->

<a name="known-bugs"/>

## XII. Known Bugs

If you are seeing 401s in the front-end, some of the possible issues are:
- The chalice `config.json` may have a misconfigured Rest API ID or authorizer ID (check the API Gateway for correct values): https://github.com/usdot-jpo-sdc/sdc-dot-webportal/blob/2734ce28a165a10078d510ac58e17b2e65cba958/webportal/lambda/.chalice/config.json#L14-L15
- The chalice `config.json` may have a misconfigured Cognito pool or IDP: https://github.com/usdot-jpo-sdc/sdc-dot-webportal/blob/2734ce28a165a10078d510ac58e17b2e65cba958/webportal/lambda/.chalice/config.json#L24-L25
- The Angular `environment.ts` may have an incorrect value for Cognito User Pool or client IDs:
  - User pool, AD Client ID, IDP name, domain: https://github.com/usdot-jpo-sdc/sdc-dot-webportal/blob/fe29d326ee83434ff0fc5f423c96b02062d193ef/webportal/webapp/src/environments/environment.prod-private.ts#L6-L9
  - Login.gov client ID: https://github.com/usdot-jpo-sdc/sdc-dot-webportal/blob/fe29d326ee83434ff0fc5f423c96b02062d193ef/webportal/webapp/src/environments/environment.prod-private.ts#L11
- The app client may be misconfigured if you are getting a 401 with a `Error verifying JWT: Invalid audience` - double check that the correct app client is being used in the configuration files and that the lambdas in `sdc-dot-cognito-account-sync` are using the correct app client.


<!---                                    -->
<!---     Credits and Acknowledgment     -->
<!---                                    -->

<a name="credits-and-acknowledgement"/>

## XIII. Credits and Acknowledgment
Thank you to the Department of Transportation for funding to develop this project.


<!---                                    -->
<!---     CODE.GOV Registration Info     -->
<!---                                    -->

<a name="code-gov-registration-info">

## XIV. CODE.GOV Registration Info
Agency:  DOT

Short Description: The Secure Data Commons is an online data warehousing and analysis platform for transportation researchers.

Status: Production

Tags: transportation, connected vehicles, intelligent transportation systems

Labor Hours:

Contact Name: sdc-support@dot.gov

<!-- Contact Phone: -->

<a name="code-quality-monitor">

## XV. Code Quality Monitor

[![Code quality status](https://codescene.io/projects/10167/status.svg) Full analysis results at **codescene.io**.](https://codescene.io/projects/10167/jobs/latest-successful/results)

---
[Back to top](#toc)
