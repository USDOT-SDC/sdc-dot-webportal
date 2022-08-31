# Rollback Plan

[v2.14.0](https://github.com/USDOT-SDC/sdc-dot-webportal/tree/2.14.0)


### If rollback is required after deployment:

1. Restore web portal files from backup:
   - `aws s3 cp backup-20220901/ s3://prod-webportal-hosting-004118380849 --recursive`


2. Refresh assets on nginx proxies, using the following command:
   - `aws ssm send-command 
   --region us-east-1 
   --document-name prod-nginx-asset-update 
   --parameters staticAssetsBucket="prod-webportal-hosting-004118380849" --targets "Key=tag:Name,Values=prod-nginx-web-proxy" 
   --comment "Deploying sdc-dot-webportal to prod at $(date) and refreshing assets"`


3. Verify the website is running.


4. Re-Add the CVP dataset item to prod_Available_Datasets table.


5. On the DATASETS page verify that the CVP dataset is listed as an option/row in the SDC dataset panel, along with WAZE, OSS4ITS, FRA-ARDS, and ACME datasets.
   - Click through each row of the remaining datasets and ensure the corresponding data dictionary/description populates (in panel below the  SDC algorithms panel).


6.  On the DATASETS page, open a REQUEST TO EXPORT DATA modal.
   - Verify that CVP is included as an option under the "For Which Project/Dataset would you like to become a Trusted User?" dropdown.
      - Confirm that WAZE, OSS4ITS, FRA-ARDS, and ACME also remain as options.
   - Verify that WYDOT, NYC, and THEA are available options under the 'Data Provider' Dropdown.
   - Verify that the following datasets are also listed as available, depending on CVP DataProvider selected:
      - For WYDOT: SPEED, CRASH, CORRIDOR, CLOSURES, RWIS, TIM, COUNT, ALERT, DMS, BSM, PIKALERT, VSL
      - For  NYC:  ASDRF, EVENT
      - For THEA:  BSM, SPAT
   - Select any ACME dataset and click 'Next' button to open the Approval Form tab.
   - Verify that any CVP dataset references once again appear on this tab, specificallly:
      - Hint for 'Anchor Dataset of interest or data provider' field is now: "e.g. CVP, Waze, ARDS, etc."
      - Hint for 'Specific sub-datasets or data types used' field is now: "e.g. Speed, BSM, Alerts, Jams, Railroad, etc."
      - Hint for 'Justification' field is now: "e.g. Used in CVP dashboard, Used for presentation at SDC Quarterly Executive Briefing, etc."


7.  On the DATASETS page, open the REQUEST TRUSTED USER STATUS modal:
   - Verify that CVP is once again an option in the "For Which Project/Dataset would you like to become a Trusted User?" dropdown.
      - Confirm that WAZE, OSS4ITS, FRA-ARDS, and ACME remain as options.
   - Verify that WYDOT, NYC, and THEA are available options under the 'Data Provider' Dropdown.
   - Verify that the following datasets are also listed as available, depending on CVP DataProvider selected:
      - For WYDOT: SPEED, CRASH, CORRIDOR, CLOSURES, RWIS, TIM, COUNT, ALERT, DMS, BSM, PIKALERT, VSL
      - For  NYC:  ASDRF, EVENT
      - For THEA:  BSM, SPAT


8. Verify that login redirects, data upload, data export, and data export approval functions are working.


9. Perform regression testing (following the UAT template):
   1. Validate iyou were able to access the portal.
   2. Validate portal login is working.
   3. Validate Import/Export/Approval functionality.
   4. Validate Trusted Request functionality.
   5. Validate launching of workstations. 
   6. Validate start/stop of workstations.
   7. Validate functionality of all the tabs in portal.


