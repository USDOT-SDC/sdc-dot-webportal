# Test Plan

[v2.12.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.12.0)

### Objectives:
The test objectives are to verify the functionality of the feature improvements defined in the CRB, as well as to ensure there's been no negative impact on the, otherwise, normal functioning of the web portal within the production environment

### In Scope:
1. Manual functional system testing of the web portal - with focus on the Data Export Form and restricted to character set found on standard US QWERTY keyboard.
2. Manual regression testing of the SDC web portal.

### Test Plan:
1. Verify the web portal s3 bucket has data from the date of deployment.


2.  On the DATASETS page:
   - verify that the new "Request Trusted User Status" button appears below the datasets table and that it opens the corresponding dialog.


3.  Within the opened REQUEST TRUSTED USER STATUS modal:
   - Verify that the Trusted Status Request will not submit with an ACME dataset which has pre-existing Trusted Status and that snackbar with error message opens when attempting to do so.
   - Verify that the Trusted Status Request submits as expected for non-trusted ACME dataset.
   - Verify that email confirmation is delivered.
   - Verify on the EXPORT REQUESTS page, that the submitted request appears in the Trusted Requests table with correct data populated there.
   - Approve or reject the request and confirm.
   - Verify that approval or rejection email confirmation is delivered.


4.  On the DATASETS page, open a REQUEST TO EXPORT DATA modal, and select any ACME dataset:
   - Verify that the Trusted Status tab does not appear when selecting either trusted and non-trusted datasets.
   - Verify that Acceptable Use Policy now appears at bottom of the Approval Form tab for non-Trusted dataset with required Accept or  Decline radio button choices.
   - Verify that Acceptable Use Policy now appears at bottom of the Approval Form tab for Trusted dataset without any radio buttons.
   - Submit data export request for 'non-trusted' ACME dataset and ensure correct info loads to the Export Requests table on the EXPORT REQUESTS page. 
   - Verify the details form will render.
   - Verify that email confirmation is received for the data export request.
   - Repeat the last 3 steps to submit an export request for a 'trusted' ACME dataset - and verify that the request loads to the Export Requests table (on the EXPORT REQUESTS page) as already approved.


5. Verify that login redirects, data upload, data export, and data export approval functions are working.
   

6. Perform regression testing:
   1. Validate if you were able to access the portal.
   2. Validate portal login is working.
   3. Validate Import/Export/Approval functionality.
   4. Validate launching of workstations. 
   5. Validate start/stop of workstations.
   6. Validate functionality of all the tabs in portal.
     
### Deliverables:
Test results will be documented within the CRB.

