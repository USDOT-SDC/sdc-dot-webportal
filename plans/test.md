# Test Plan

[v2.15.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.15.0)

### Objectives:
The test objectives are to verify the functionality of the feature improvements defined in the CRB, as well as to ensure there's been no negative impact on the, otherwise, normal functioning of the web portal within the production environment

### In Scope:
1. Manual functional system testing of the web portal.
2. Manual regression testing of the SDC web portal.

### Test Plan:
1. Verify the web portal s3 bucket has data from the date of deployment.


2.  On the EXPORT REQUESTS page:
   - Under the 'Export File for Review' column confirm the file copy icons changed to cloud download icons.


3. On the DATASETS page:
   - Create a file export request for ACME data, using the oneGBtestfile.txt.  Proceed to the Export REQUESTS page, confirm the corresponding file export request appears there, and then click on the file download icon.  
   - Confirm the file downloads successfully.
   - Repeat test with 75MB, and 2MB sized files.


4. Confirm the 1GB or 75MB file downloads successfully using, Chrome, Firefox, and Edge Browsers


5.  In coordination with WAZE Data Stewards:
   - Create a 2nd file export request, using the WAZE dataset and a smaller sized (~2MB) test file. 
   - Confirm the WAZE DataSteward can download the file to their local client.



6. Verify that login redirects, data upload, data export, and data export approval functions are working.
   

7. Perform regression testing (following the UAT template):
   1. Validate you're able to access the portal.
   2. Validate portal login is working.
   3. Validate Import/Export/Approval functionality.
   4. Validate Trusted Request functionality.
   5. Validate launching of workstations. 
   6. Validate start/stop of workstations.
   7. Validate functionality of all the tabs in portal.
   
     
### Deliverables:
Test results will be documented within the CRB.

