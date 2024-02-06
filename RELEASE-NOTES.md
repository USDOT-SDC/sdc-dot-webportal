# SDC Data Lake Pipeline Release Notes

# Get This Release

​To deploy this release, select this version's tag and follow the instructions in the [Deployment Plan](plans/deployment.md).

## 3.1.5 (2024-02-07)

- Fixed known issue where uploading new file under same name was treated as old file so you could export files that were not approved

## 3.1.4 (2024-01-17)

- Edited portal footer by getting rid of contract number

## 3.1.3 (2023-12-15)

- Updated access request form
- Added Data Agreement Form Link
- Made HSIS Data Request Form open in new tab / updated link

## 3.1.2 (2023-11-22)

- add current team buckets to lambda_trigger_buckets var

## 3.1.1 (2023-11-22)

- Added GUI Data Ingest feature to the datasets page. Allows users to upload to S3 in the locations provided by their upload_locations variable in session storage. Users can now upload to multiple locations if allowed and create sub-prefixes under those locations.

## 3.1.0 (2023-11-09)

- Dataset descriptions now show up
- Updated screenshots in FAQ
- Updated deployment plan on web portal repo to include the incremental updates and versions
- Redid titles of pages to have the selected one highlighted

**May 10, 2023. SDC sdc-dot-webportal Release 3.0.0**

### What's New in Release 3.0.0

- Overhaul of all deprecated packages including Cognito user authentication.
- Changes to tables throughout the webportal to make them more readable.
- Refactored to Angular v15

**December 9, 2022. SDC sdc-dot-webportal Release 2.17.0**

### What's New in Release 2.17.0

- Helpful Links section has been added to the FAQ page.
- FAQ answers have been updated.

**November 3, 2022. SDC sdc-dot-webportal Release 2.16.0**

### What's New in Release 2.16.0

- Users can now request approval for their tables to be exported the the public Edge DB.
- The Datasets page has been updated with a button/form to submit their requests.
- The Export Requests page has been updated with a new 'Export Table Requests' table.

**October 21, 2022. SDC sdc-dot-webportal Release 2.15.0**

### What's New in Release 2.15.0

- The 'Export File for Review' feature has been modified so that files can be downloaded for review outside of an SDC workstation.

**September 1, 2022. SDC sdc-dot-webportal Release 2.14.0**

### What's New in Release 2.14.0

- References to CVP data have been expunged from the Web Portal UI.

**April 28, 2022. SDC sdc-dot-webportal Release 2.13.0**

### What's New in Release 2.13.0

- The Trusted User Status Request has been moved from the Data Export Request form to a separate dialog box.

**February 04, 2022. SDC sdc-dot-webportal Release 2.12.0**

### What's New in Release 2.12.0

- The message "Alpha-numeric characters only" has been added to user input fields in the 'Request to Export Data' form.
- Encoding (for requests which are generated as part of data export form submission) has been changed to handle more characters.

**January 19, 2022. SDC sdc-dot-webportal Release 2.11.0**

### What's New in Release 2.11.0

- The Sign Up link on the Register page now refers to the external page where the 'Researcher Agreement and Access Request' form is maintained.

**January 13, 2022. SDC sdc-dot-webportal Release 2.10.0**

### What's New in Release 2.10.0

- The font and dimensions of the 'Request to Export Data' form have been increased.
- Buttons within the form have been reorganized and a Previous button has been added for improved user navigation.
- The form will now remain open upon a background click.

**December 8, 2021. SDC sdc-dot-webportal Release 2.9.0**

### What's New in Release 2.9.0

- The Request to Export Data Form has been improved with consolidated dataset description requirements on the Approval Form tab.
- The description on the Trusted Status tab has been revised for improved clarity.

**November 24, 2021. SDC sdc-dot-webportal Release 2.8.1**

### What's New in Release 2.8.1

- Bug fix for register/login redirects.

**February 10, 2021. SDC sdc-dot-webportal Release 2.8**

### What's New in Release 2.8

- The workstation resizing message has been updated so the user is told to stop their workstation and save their work before resize.
- The SDC Support email address change is being deployed to the post-migration site.
- The message about PII or CBI data is being deployed to the post-migration site.

**August 21, 2020. SDC sdc-dot-webportal Release 2.7**

### What's New in Release 2.7

- Change SDC support email address from support@securedatacommons.com to sdc-support@dot.gov

**August 7, 2020. SDC sdc-dot-webportal Release 2.6.1**

### What's New in Release 2.6.1

- PDF for SDC Access Request Form updated to v2
- The words "Data Definition" have been removed from the information titles for the projects
- The workstation resizing bug has been fixed with providing ARM workstations as possible choices
- A notification is shown before uploading data to the SDC to inform the user no PII or CBI data is allowed to be uploaded

**July 7, 2020. SDC sdc-dot-webportal Release 2.6**

### What's New in Release 2.6

- Change URL for the Secure Data Commons Webportal from portal.securedatacommons.com to portal.sdc.dot.gov
- Create a redirect for traffic from securedatacommons.com to sdc.dot.gov
- Enable PIV log-in for DOT users

**April 7, 2020. SDC sdc-dot-webportal Release 2.5**

### What's New in Release 2.5

- Add Auto-Export request option for users with trusted status in the export request pop-up window
- Add Auto-Export request approving menu for data providers in the export requests tab
  \*\* Includes justification provided by Data Analyst

**April 4, 2020. SDC sdc-dot-webportal Release 2.4.1**

### What's New in Release 2.4.1

- Inject the Cognito user pool through the environment so all environments do not need to use the dev Cognito pool

**January 28, 2020. SDC sdc-dot-webportal Release 2.4**

### What's New in Release 2.4

- Change login functionality to allow users to be redirected to Login.gov
- Add syncing screen after login from Login.gov so users can sync their Login.gov account with their SDC account

**November 11, 2019. SDC sdc-dot-webportal Release 2.3**

### What's New in Release 2.3

- Bug fix for export functionality

**November 1, 2019. SDC sdc-dot-webportal Release 2.2**

### What's New in Release 2.2

- Provides a new feature for users to modify their workstation to a different configuration on-demand
- Provides a new feature for users to schedule workstation uptime, so users can continue to keep their workstations running without being stopped by the nightly process

**August 8, 2019. SDC sdc-dot-webportal Release 2.1**

### What's New in Release 2.1:

- Enabled HTTP Strict Transport Security (HSTS) policy to ensure data is encrypted before it is sent, making it impossible for attackers to read or modify the data in transit to the authenticated server. HSTS protects against HTTP downgrade attacks (SSL stripping attacks) by requiring all traffic to use HTTPS, and rewrites requests that do not point to encrypted sources.
