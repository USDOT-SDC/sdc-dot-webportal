# Test Plan

[v2.9.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.9.0)

### Objectives:
The test objectives are to verify the functionality of the feature improvements defined in the CRB, as well as to ensure there's been no negative impact on the, otherwise, normal functioning of the web portal within the production environment

### Scope:
1. Manual functional system testing of the web portal - with focus on the Approval Form and Trusted Status tabs of the Request for Data Export Form.
2. Manual regression testing of the web portal.

### Test Plan:
1. Verify the web portal s3 bucket has data from the date of deployment. 

2. Login to the production web portal and navigate to the DataSets page.
   - Verify that the Data Export Form/Approval Form requests only the following 7 fields listed, ordered and labeled, as follows:
      1. Name or short description of your derived dataset
      2. Detailed description of the derived dataset
      3. Anchor dataset of interest or data provider
      4. Specific sub-datasets or data types used
      5. Additional data sources
      6. Tags
      7. Justification of Export

   - Verify that the Trusted Status data description reads as follows:
     - Trusted Status is a mechanism to help speed the turnaround of future, similar export requests. Obtaining Trusted Status eliminates the Data Provider review/approval requirements for subsequent, similar requests - and will enable immediate export of data, at the time of your request.
           A separate Trusted Status should be acquired, depending on each specific combination of Project, Data Provider, and Sub-DataSet/Data Type requested for export.

3. Perform regression testing
   - Upon successful deployment, please validate below scenarios and make sure everything is working as expected:
      1. Validate if you were able to access the portal.
      2. Validate portal login is working.
      3. Validate Import/Export/Approval functionality.
      4. Validate launching of workstations.
      5. Validate start/stop of workstations.
      6. Validate by functionality of all the tabs in portal.
      
### Deliverables:
Test results will be documented within the CRB.

