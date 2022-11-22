# Risk Mitigation Plan

[v2.16.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.16.0)


### Risk Identification:
 Errors in Angular or Lambda code modifications and/or conflict with modified API resources identified upon deployment to production environment.

### Risk Assessment: 
2 out of 5

### Risk Mitigation: 
- Prior to deploy to production, all Angular and lambda code changes are deployed to development environment, along with updated API and Glue resources, where project functionality is end to end tested.
-  Immediately upon deployment to the production environment, WebPortal UI/Lambda changes will be UA and Regression tested, in conjunction with a series of end-to-end tests, during scheduled downtime.

- A back-up copy of the previously released WebPortal UI code is created and saved on the build machine so that, if any problems are detected during or after deployment, immediate rollback/revert  of the WebPortal code is facilitated.  See Deployment.md and Rollback.md for specific steps.
- A back-up copy of the previously released lambda code is also created and stored on the build machine, so that it's readily accessible if immediate rollback is needed.
- In the case where any API changes need to be reverted, the API can be reverted to a previous stage via the AWS API Gateway console.

- Deployment of WebPortal and Lambda code updates will be made in coordination with the Edge DB Architecture production modifications during scheduled downtime.
