# Test Plan

This Test Plan is designed to prescribe the scope, objectives, test activities and
deliverables of the testing activities for these resources.

### In Scope Test Plan

Verify the following and document results in the CRB.

1. Verify the web portal s3 bucket has data from the date of deployment.
1. On the FAQ page:
   - verify that the new 'Helpful Links' section appears below the existing 'My Datasets/Algorithm' panel.
   - verify that each link opens properly.
   - verify the new FAQ content appears as expected
   - ensure any links in that section work also
1. Verify that login redirects, data upload, data export, and data export approval functions are working.
1. Perform regression testing (following the UAT template):
   1. Validate you're able to access the portal.
   1. Validate portal login is working.
   1. Validate Import/Export/Approval functionality.
   1. Validate Trusted Request functionality.
   1. Validate launching of workstations.
   1. Validate start/stop of workstations.
   1. Validate functionality of all the tabs in portal.

### Out of Scope AWS Resources

- Resources created durning previous deployments

### Objectives

The test objectives are to verify the functionality of the resources, and should focus on
testing the in scope resources to guarantee they work normally in a production environment.

### Deliverables:

Test results will be documented within the CRB.
