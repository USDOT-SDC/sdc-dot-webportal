# Test Plan

[v2.11.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.11.0)

### Objectives:
The test objectives are to verify the functionality of the feature improvements defined in the CRB, as well as to ensure there's been no negative impact on the, otherwise, normal functioning of the web portal within the production environment

### In Scope:
1. Manual functional system testing of the web portal - with focus on the Data Export Form.
2. Manual regression testing of the SDC web portal.

### Test Plan:
1. Verify the web portal s3 bucket has data from the date of deployment.


2. Navigate to the beta-portal-sdc.dot.gov/register page, and verify the following under the SIGN UP heading:
   1. The 'external link' icon appears to the right of the Access Request Form link.
   2. The tooltip '(link is external)' appears when hovering over the external link icon.
   3. The Access Request Form link opens 'https:// securedatacommons.atlassian.net/wiki/spaces/DESK/pages/1349484563/RT+Form+Researcher+Agreement+and+Access+Request' in a seperate tab.
   4. The paragraph below SIGN UP heading reads:
     - "Please download the access request form linked below, fill out the required details and send an email to sdc-support@dot.gov. Once approved, we will send you an email with the instructions for accessing the platform."
   

3. Perform regression testing:
   1. Validate if you were able to access the portal.
   2. Validate portal login is working.
   3. Validate Import/Export/Approval functionality.
   4. Validate launching of workstations. 
   5. Validate start/stop of workstations.
   6. Validate by functionality of all the tabs in portal.
     
### Deliverables:
Test results will be documented within the CRB.

