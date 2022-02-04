# Test Plan

[v2.12.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.12.0)

### Objectives:
The test objectives are to verify the functionality of the feature improvements defined in the CRB, as well as to ensure there's been no negative impact on the, otherwise, normal functioning of the web portal within the production environment

### In Scope:
1. Manual functional system testing of the web portal - with focus on the Data Export Form and restricted to character set found on standard US QWERTY keyboard.
2. Manual regression testing of the SDC web portal.

### Test Plan:
1. Verify the web portal s3 bucket has data from the date of deployment.


2. Navigate to the beta-portal-sdc.dot.gov/account/datasets page, open and REQUEST TO EXPORT DATA modal, select any ACME dataset, and verify the following:
   1. On the Approval Form and Auto-Export Status tabs, verify that hint message "Alpha-numeric characters only" right-aligned under each non-prepopulated field. Font color should be light gray.
   2. Verify that hint messages are replaced with "Required" error msg. when a "required" form field is touched and then left empty.
   3. Verify that the hint messages reappear once data is entered into the empty, "required" form field.
   4. Verify that export request submits successfully when entering '&' ';' or '#' characters into any of the fields on either the Approval Form or Auto-Export Status tabs.
   5. Verify that export request also submits successfully for entries that include each of the remaining 29, out of 32, special characters.
   

3. Perform regression testing:
   1. Validate if you were able to access the portal.
   2. Validate portal login is working.
   3. Validate Import/Export/Approval functionality.
   4. Validate launching of workstations. 
   5. Validate start/stop of workstations.
   6. Validate by functionality of all the tabs in portal.
     
### Deliverables:
Test results will be documented within the CRB.

