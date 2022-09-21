# Test Plan

[v2.14.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.14.0)

### Objectives:
The test objectives are to verify the functionality of the feature improvements defined in the CRB, as well as to ensure there's been no negative impact on the, otherwise, normal functioning of the web portal within the production environment

### In Scope:
1. Manual functional system testing of the web portal - with focus on the new Table Export Request button/form on the Datasets page and the new Table Export Requests table on the Export Requests page.
2. Manual regression testing of the SDC web portal.

### Test Plan:
1. Verify the web portal s3 bucket has data from the date of deployment.


2.  On the DATASETS page:
   - verify that the new "My Edge Database Panel" appears below the existing "My Datasets/Algorithm panel.
   - verity that the new "Request Table Export to Edge DB" button appears within the new panel and it opens the corresponding dialog.


3.  Within the opened Request Table Export to Edge DB modal:
   - Verify the team name 'sdc-support' is pre-loaded to the 'My Database' form field and cannot be edited.
   - Verify that the 'Submit' button does not activate unless all required fields have a response 
   - Verify that a table request submits for a 'trusted' ACME  dataset and that snackbar with error message opens when attempting to do so.
   - Verify the same for a 'non-trusted; ACME dataset.
   - Verify that email confirmation is delivered to POC's successfully.
   - Verify on the EXPORT REQUESTS page, that the submitted requests appear in the new "Table Export Requests' table with correct data populated there.
   - Approve or reject the request and confirm.
   - Verify that approval or rejection email confirmation is delivered.


4. Verify that login redirects, data upload, data export, and data export approval functions are working.
   

6. Perform regression testing (following the UAT template):
   1. Validate you're able to access the portal.
   2. Validate portal login is working.
   3. Validate Import/Export/Approval functionality.
   4. Validate Trusted Request functionality.
   5. Validate launching of workstations. 
   6. Validate start/stop of workstations.
   7. Validate functionality of all the tabs in portal.
   
     
### Deliverables:
Test results will be documented within the CRB.

