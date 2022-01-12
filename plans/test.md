# Test Plan

[v2.10.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.9.0)

### Objectives:
The test objectives are to verify the functionality of the feature improvements defined in the CRB, as well as to ensure there's been no negative impact on the, otherwise, normal functioning of the web portal within the production environment

### In Scope:
1. Manual functional system testing of the web portal - with focus on the Data Export Form.
2. Manual regression testing of the SDC web portal.

### Test Plan:
1. Verify the web portal s3 bucket has data from the date of deployment.


2. Login to the production web portal, navigate to the DataSets page, and verify the following for the Data Export Request modal:
   1. The modal/form will open successfully.
   2. The modal's width has increased to match the table borders of the background/opening page, and height has also increased vs. previous release (inspects to 65vw x 75vh).
   3. For Trusted and Non-Trusted datasets/each:
      1. Ensure that Cancel, Previous, Next, Submit buttons are aligned as per SDC-4197.
      2. Ensure that Cancel, Previous, Next, Submit buttons function properly.
   4. Verify font-size for tab labels, form field data is 16px.
   5. Verify that floating labels have also increased in scale to .90.
   

3. Perform regression testing:
   1. Validate if you were able to access the portal.
   2. Validate portal login is working.
   3. Validate Import/Export/Approval functionality.
   4. Validate launching of workstations. 
   5. Validate start/stop of workstations.
   6. Validate by functionality of all the tabs in portal.
     
### Deliverables:
Test results will be documented within the CRB.

