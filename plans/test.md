# Test Plan

[v2.14.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.14.0)

### Objectives:
The test objectives are to verify the functionality of the feature improvements defined in the CRB, as well as to ensure there's been no negative impact on the, otherwise, normal functioning of the web portal within the production environment

### In Scope:
1. Manual functional system testing of the web portal.
2. Manual regression testing of the SDC web portal.

### Test Plan:
1. Verify the web portal s3 bucket has data from the date of deployment.


2.  On the DATASETS page:
   - Verify that the SDC Datasets panel does not reflect a row for the CVP dataset.
   - Only WAZE, OSS4ITS, FRA-ARDS, and ACME remain.
   - Click through each row of the remaining datasets and ensure the corresponding data dictionary/description populates (in panel below the  SDC algorithms panel).


3.  Open the REQUEST TRUSTED USER STATUS modal:
   - Verify that CVP is no longer an option in the "For Which Project/Dataset would you like to become a Trusted User?" dropdown.
      - Confirm that WAZE, OSS4ITS, FRA-ARDS, and ACME remain as options.


4.  On the DATASETS page, open a REQUEST TO EXPORT DATA modal:
   - Verify that CVP is no longer an option under the "For Which Project/Dataset would you like to become a Trusted User?" dropdown.
      - Confirm that WAZE, OSS4ITS, FRA-ARDS, and ACME remain as options.
   - Select any ACME dataset and click 'Next' button to open the Approval Form tab.
   - Verify that any CVP dataset references have been removed from all form field hints on this tab, specificallly:
      - Hint for 'Anchor Dataset of interest or data provider' field is now: "e.g. Waze, ARDS, etc."
      - Hint for 'Specific sub-datasets or data types used' field is now: "e.g. Alerts, Jams, Railroad, etc."
      - Hint for 'Justification' field is now: "e.g. Used in visualization dashboard, Used for presentation at SDC Quarterly Executive Briefing, etc."


5. Verify that login redirects, data upload, data export, and data export approval functions are working.
   

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

