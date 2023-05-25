# Test Plan

[3.0.1](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/3.0.1)

### Objectives:

The test objectives are to verify the functionality of the feature improvements defined in the CRB, as well as to ensure there's been no negative impact on the, otherwise, normal functioning of the web portal within the production environment

### In Scope:

1. Manual functional system testing of the web portal - with focus on the new 'Table Export Request' button/form on the Datasets page and the new 'Table Export Requests' table on the Export Requests page.
2. Manual regression testing of the SDC web portal.

### Test Plan:

1. Verify the web portal s3 bucket has data from the date of deployment.

2. On the FAQ page:

- verify that the new 'Helpful LInksl' section appears below the existing 'My Datasets/Algorithm' panel.
- verify that each link opens properly.
- verify the new FAQ content appears as expected
- ensure any links in that section work also

3. Verify that login redirects, data upload, data export, and data export approval functions are working.

4. Perform regression testing (following the UAT template):
   1. Validate you're able to access the portal.
   2. Validate portal login is working.
   3. Validate Import/Export/Approval functionality.
   4. Validate Trusted Request functionality.
   5. Validate launching of workstations.
   6. Validate start/stop of workstations.
   7. Validate functionality of all the tabs in portal.

### Deliverables:

Test results will be documented within the CRB.
