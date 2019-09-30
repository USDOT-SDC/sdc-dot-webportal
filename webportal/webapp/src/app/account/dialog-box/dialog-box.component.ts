import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';
// import { ProgressHttp } from "angular-progress-http";
// import { Headers, RequestOptions } from '@angular/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatTooltipModule, MatSnackBar, MatDatepicker, MatRadioModule, MatCheckboxModule, MatTabsModule } from '@angular/material';
import { ApiGatewayService } from '../../../services/apigateway.service';
import { CognitoService } from '../../../services/cognito.service';
import { element } from 'protractor';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
// import {Md5} from 'ts-md5/dist/md5';

@Component({
    selector: 'app-dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.css']
})

export class DialogBoxComponent implements OnInit {
    // protected options: RequestOptions;
    fileName: string;
    mailType: string;
    requestType: string;
    userBucketName: string;
    // selectedFiles: FileList;
    selectedFiles: any[] = [];
    message: string;
    datasetName: string;
    userEmail: string;
    userName: string;
    showDataset: boolean;
    showAlgorithm: boolean;
    uploadedFilesCount = 0;
    selectedIndex = 0;
    userTrustedStatus: any;
    datasettype: string;
    selectedDataSet: string;
    selectedDataProvider: string;
    selectedDatatype: string;
    datasources: string;
    deriveddataset: string;
    detailedderiveddataset: string;
    tags: string;
    justifyExport: string;
    trustedStatus: boolean;
    exportWorkflow: any;
    expWorkflow: any;
    derivedDataSetname: string;
    dataprovider: string;
    datatype: string;
    export: any[] = [];
    allProvidersJson: any;
    allDataTypes: any;
    trustedRequest: string;
    acceptableUse: string;
    approvalForm: string;
    derivedDataSet: string;
    dataType: string;
    dataSources: string;
    detailedDerivedDataset: string;
    derivedDataSetName: string;
    trustedAcceptableUseDisabled: boolean;
    resizeFilterFormSubmitted = false;
    diskSizeChange = true;
    cpuOptions = [2, 4, 8, 16, 24, 36, 40, 48, 60, 64, 72, 96, 128];
    memoryOptions = [2, 3.75, 4, 5.25, 7.5, 8, 10.5, 15, 15.25, 16, 21, 30, 30.5, 32, 42, 61, 64, 72, 96, 128, 144, 160, 192, 256, 384, 768];
    // tslint:disable-next-line:max-line-length
    additionalDiskSizeOptions = [2, 3.75, 4, 5.25, 7.5, 8, 10.5, 15, 15.25, 16, 21, 30, 30.5, 32, 42, 61, 64, 72, 96, 128, 144, 160, 192, 256, 384, 768];
    operatingSystem: string;
    defaultInstanceType: string;
    instanceId: string;
    selectedCpu: string;
    selectedMemory: string;
    resizeWorkSpaceOnly = false;
    resizeAddDiskOnly = false;
    ManageBoth = false;
    // TODO
    scheduleUpTime = false;
    additionalDiskSpace = '';
    @ViewChild('fileUpload') fileUpload: FileUpload;

    dataTypes = [
        { value: 'dataset', viewValue: 'Dataset' },
        { value: 'algorithm', viewValue: 'Algorithm' },
    ];

    Categories = [
        { value: 'raw', viewValue: 'Raw' },
        { value: 'curated', viewValue: 'Curated' },
        { value: 'published', viewValue: 'Published' },
    ];

    dataSetTypes = [];

    pricing = [];
    requestedInstanceType = undefined;
    instanceFamilyList = [];
    recommendedInstanceFamilyList = [];
    pricingGroups = [];
    systemDate = new Date();
    workSpaceFromDate = new Date();
    diskSpaceFromDate = new Date();
    diskSpaceToDate = null;
    workSpaceToDate = null;
    uptimeFromDate = new Date();
    uptimeToDate = null;
    callResolved = false;
    instanceState = '';

    dataProviderNames = [];
    subDataSets = [];
    subDataSetsWydot = [];
    currentConfigurations = [];
    vcpu = '';
    desiredMemory = '';
    blockVolumeManage = false;
    startAfterResize = false;
    didManageWorkStation = {posted: false, data: {}};
    disableUptimeOption = false;
    schedulesOnInstance = [];
    currentConfiguration = '';

    // cvPilotDataSets:string[] = new Array("Wyoming","Tampa Hillsborough Expressway Authority","New York City DOT","All Sites")

    messageModel = {
        name: '',
        stateList: '',
        dotEmployee: '',
        dotEmployeeEmail: '',
        dotEmployeeExistingContract: '',
        fileFolderName: '',
        type: 'dataset',
        category: '',
        bucketName: '',
        description: '',
        readmeFileName: '',
        geographicScope: '',
        dataAvailability: '',
        ProgrammingTool: '',
        isCVPilotTeamMember: '',
        cvPilotTeamName: '',
        isCVPilotIETMember: '',
        accessReason: '',
        cvPilotDataSets: '',
        datasettype: '',
        selectedDataSet: '',
        dataProviderName: '',
        subDataSet: '',
        datasources: '',
        deriveddataset: '',
        detailedderiveddataset: '',
        tags: '',
        justifyExport: '',
        derivedDatasetname: '',
        dataprovider: '',
        datatype: ''

    };

    resize = {
        cpu: '',
        memory: '',
        defaultInstanceType: '',
        operatingSystem: ''
    };

    currentStack = {};
    states = {};
    volumeCount = '';

    // tslint:disable-next-line:max-line-length
    constructor(private gatewayService: ApiGatewayService, private router: Router, private location: Location, private http: HttpClient, private cognitoService: CognitoService, public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<DialogBoxComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.messageModel.bucketName = data.bucketName;
        this.mailType = data.mailType;
        this.datasetName = data.datasetName;
        this.messageModel.fileFolderName = data.datasetName;
        this.requestType = data.requestType;
        this.userBucketName = data.userBucketName;
        this.datasettype = data.datasettype;
        this.trustedRequest = 'No';
        this.acceptableUse = '';
        this.trustedAcceptableUseDisabled = false;
        this.approvalForm = data.approvalForm;
        this.operatingSystem = data.stack && data.stack.operating_system;
        this.defaultInstanceType = data.stack && data.stack.instance_type;
        this.instanceId = data.stack && data.stack.instance_id;
        this.currentConfiguration = data.stack && data.stack.configuration;
        this.currentStack = data.stack;
        this.states = data.states;
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    ngOnInit() {
        this.userEmail = sessionStorage.getItem('email');
        this.userName = sessionStorage.getItem('username');
        (this.mailType === 'reSize Request') && this.setDisableCurrentConfigurations();
        const trustedStatus = sessionStorage.getItem('userTrustedStatus');
        console.log('Trusted status' + trustedStatus);
        this.userTrustedStatus = JSON.parse(trustedStatus);
        console.log('Trusted status' + this.userTrustedStatus);
        const expWorkflow = sessionStorage.getItem('exportWorkflow');
        this.expWorkflow = JSON.parse(expWorkflow);

        this.exportWorkflow = JSON.parse(sessionStorage.getItem('datasets'));
        console.log(this.exportWorkflow);
        for (let i = 0; i < this.exportWorkflow.length; i++) {
            const exportW = this.exportWorkflow[i];
            this.export.push(exportW.exportWorkflow);
        }
        const datasets = [];
        for (let j = 0; j < this.export.length; j++) {
            console.log('Inside:' + this.export[j]);
            if (this.export[j]) {
                console.log('Inside:' + this.export[j]);
                const dataset = {};
                dataset['value'] = Object.keys(this.export[j])[0];
                dataset['viewValue'] = Object.keys(this.export[j])[0];
                this.dataSetTypes.push(dataset);
                // datasets.push(Object.keys(this.export[j]));
            }
        }
        console.log(this.dataSetTypes);
        if (this.mailType === 'reSize Request') {
            this.instanceState = this.states[this.instanceId];
            // let exportWorkflow = sessionStorage.getItem('exportWorkflow');
            // this.exportWorkflow = JSON.parse(exportWorkflow);
            this.getScheduleUptimeData();
            this.shouldAllowManageVolume();
        }
    }

    shouldAllowManageVolume() {
        // Disable add disk space feature if user has already did 2 or more increase disk-space requests in last 1 hour.
        if (localStorage.getItem('volumeCountLastModified')) {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:radix
            this.volumeCount = localStorage.getItem('volumeCount') ? (parseInt(localStorage.getItem('volumeCount')) + 0).toString() : '0';
            // tslint:disable-next-line:radix
            const currentDate = Date.parse(new Date().toString());
            // tslint:disable-next-line:radix
            const lastUpdatTime = Date.parse(localStorage.getItem('volumeCountLastModified'));
            if (((currentDate - lastUpdatTime) / (1000) / (60) / (60) ) < 1) {
                // tslint:disable-next-line:radix
                if (parseInt(this.volumeCount) >= 2) {
                    this.blockVolumeManage = true;
                }
            }
        }
    }

    setDataProviders(event) {
        console.log(event.value);
        this.dataProviderNames = [];
        this.subDataSets = [];
        this.selectedDataSet = this.messageModel.datasettype;
        for (let j = 0; j < this.exportWorkflow.length; j++) {
            const exportW = this.exportWorkflow[j];
            if (exportW.exportWorkflow && exportW.exportWorkflow[event.value]) {
                this.allProvidersJson = exportW.exportWorkflow[event.value];
                for (let j = 0; j < Object.keys(this.allProvidersJson).length; j++) {
                    const dataProvider = {};
                    dataProvider['value'] = Object.keys(this.allProvidersJson)[j];
                    dataProvider['viewValue'] = Object.keys(this.allProvidersJson)[j];
                    this.dataProviderNames.push(dataProvider);
                }
            }
        }
        console.log(this.dataProviderNames);
    }

    setSubDatasets(event) {
        console.log(event.value);
        this.subDataSets = [];
        this.selectedDataProvider = this.messageModel.dataProviderName;
        console.log(this.allProvidersJson);
        // for (var j=0; j < this.allProvidersJson.length; j++){
        const value = this.allProvidersJson[event.value];
        if (value) {
            const allDataTypesForProvider = value.datatypes;
            for (let j = 0; j < Object.keys(allDataTypesForProvider).length; j++) {
                const dataType = {};
                dataType['value'] = Object.keys(allDataTypesForProvider)[j];
                dataType['viewValue'] = Object.keys(allDataTypesForProvider)[j];
                this.subDataSets.push(dataType);
            }
        }
        console.log(this.subDataSets);
    }
    selectedIndexChange(val: number) {
        console.log('--- ', val, ' ---');
        this.selectedIndex = val;
    }

    onSelectionOfDataset() {
        this.selectedDataSet = this.messageModel.datasettype;
        this.selectedDataProvider = this.messageModel.dataProviderName;
        this.selectedDatatype = this.messageModel.subDataSet;
        console.log('SelectedDataType:' + this.selectedDatatype);
        const key = this.selectedDataSet + '-' + this.selectedDataProvider + '-' + this.selectedDatatype;
        this.trustedStatus = key in this.userTrustedStatus;
        // add the trusted status logic here
        // this.trustedStatus = true;
        this.selectedIndex = 1;
    }
    onApprovalformClick() {
        this.selectedDataSet = this.messageModel.datasettype;
        this.selectedDataProvider = this.messageModel.dataProviderName;
        this.selectedDatatype = this.messageModel.subDataSet;

        this.derivedDataSetName = this.messageModel.derivedDatasetname;
        this.dataType = this.messageModel.datatype;
        this.dataSources = this.messageModel.datasources;
        this.derivedDataSet = this.messageModel.deriveddataset;
        this.detailedDerivedDataset = this.messageModel.detailedderiveddataset;
        this.tags = this.messageModel.tags;
        this.justifyExport = this.messageModel.justifyExport;

        this.selectedIndex = 2;
    }
    validateEmailRegex(email) {
        const regexEmail = new RegExp('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?');
        return regexEmail.test(email);
    }

    sendMail() {
        if (this.mailType === 'Access Request Mail' && this.datasetName !== 'U.S DOT Connected Vehicle Pilot (CVP) Evaluation Datasets') {
            this.message = '<div>' +
                '    Hello,<br><br>' +
                '    Please approve the request for Dataset Access.<br>' +
                '    <ul>' +
                '        <li>Dataset Name = ' + this.datasetName + '</li>' +
                '        <li>Bucket Name = ' + this.messageModel.bucketName + '</li>' +
                '        <li>User is a USDOT employee or researcher = ' + this.messageModel.dotEmployee + '</li> <br>' +
                '        <li>USDOT employee email address = ' + this.messageModel.dotEmployeeEmail + '</li> <br>' +
                '        <li>User has a data agreement with the provider = ' + this.messageModel.dotEmployeeExistingContract + '</li> <br>' +
                '        <li>State List = ' + this.messageModel.stateList + '</li> <br>' +
                '        <li>Sender Name = ' + this.userName + '</li>' +
                '        <li>Sender E-mail id = ' + this.userEmail + '</li>' +
                '    </ul>' +
                '    Thanks, <br>' + this.userName +
                '</div>';
        } else {
            if (this.mailType === 'Access Request Mail' && this.datasetName === 'U.S DOT Connected Vehicle Pilot (CVP) Evaluation Datasets') {
                this.message = '<div>' +
                    '    Hello,<br><br>' +
                    '    Please approve the request for Dataset Access.<br>' +
                    '    <ul>' +
                    '        <li>Dataset Name = ' + this.datasetName + '</li>' +
                    '        <li>Bucket Name = ' + this.messageModel.bucketName + '</li>' +
                    '        <li>User is a member of either the NYC, THEA or Wyoming CV Pilot Team? = ' + this.messageModel.isCVPilotTeamMember + '</li> <br>' +
                    '        <li>User is affiliated with CV Pilot Team = ' + this.messageModel.cvPilotTeamName + '</li> <br>' +
                    '        <li>User is a member of the CV Pilot Independent Evaluation Team? = ' + this.messageModel.isCVPilotIETMember + '</li> <br>' +
                    '        <li>User is requesting data access to CV Pilot datasets = ' + this.messageModel.cvPilotDataSets + '</li> <br>' +
                    '        <li>Reason for data access request to CV Pilot datasets = ' + this.messageModel.accessReason + '</li> <br>' +
                    '        <li>Sender Name = ' + this.userName + '</li>' +
                    '        <li>Sender E-mail id = ' + this.userEmail + '</li>' +
                    '    </ul>' +
                    '    Thanks, <br>' + this.userName +
                    '</div>';
            } else if (this.messageModel.type === 'dataset') {
                this.message = '<div> Hello,<br><br>Please approve the request for publishing the datasets.<br>' +
                    '    <ul>' +
                    '        <li>Dataset / Algorithm Name = ' + this.datasetName + '</li>' +
                    '        <li>Type = ' + this.messageModel.type + '</li>' +
                    '        <li>Category = ' + this.messageModel.category + '</li>' +
                    '        <li>File Name = ' + this.messageModel.name + '</li>' +
                    '        <li>Description = ' + this.messageModel.description + '</li>' +
                    '        <li>Readme / Data dictionary file name = ' + this.messageModel.readmeFileName + '</li>' +
                    '        <li>Geographic Scope = ' + this.messageModel.geographicScope + '</li>' +
                    '        <li>Start/End Date for Data Availability = ' + this.messageModel.dataAvailability + '</li> <br>' +
                    '        <li>Sender Name = ' + this.userName + '</li>' +
                    '        <li>Sender E-mail id = ' + this.userEmail + '</li>' +
                    '    </ul>' +
                    '    Thanks, <br>' + this.userName +
                    '</div>';
            } else if (this.messageModel.type === 'algorithm') {
                this.message = '<div> Hello,<br><br>Please approve the request for publishing the datasets.<br>' +
                    '    <ul>' +
                    '        <li>Dataset / Algorithm Name = ' + this.datasetName + '</li>' +
                    '        <li>Type = ' + this.messageModel.type + '</li>' +
                    '        <li>File Name = ' + this.messageModel.name + '</li>' +
                    '        <li>Description = ' + this.messageModel.description + '</li>' +
                    '        <li>Readme / Data dictionary file name = ' + this.messageModel.readmeFileName + '</li>' +
                    '        <li>Programming Tools/language = ' + this.messageModel.ProgrammingTool + '</li>  <br>' +
                    '        <li>Sender Name = ' + this.userName + '</li>' +
                    '        <li>Sender E-mail id = ' + this.userEmail + '</li>' +
                    '    </ul>' +
                    '    Thanks, <br>' + this.userName +
                    '</div>';
            } 
        }
        this.gatewayService.sendRequestMail('send_email?sender=' + this.userEmail + '&message=' + this.message).subscribe(
            (response: any) => {
                this.snackBar.open('Your request has been sent successfully', 'close', {
                    duration: 2000,
                });
                if (this.didManageWorkStation['posted'] && this.didManageWorkStation['data']['manageWorkstation']) {
                    this.triggerManageWorkStationCallback();
                }
                this.onNoClick();

                console.log('Access Request Sent Successfully');
            }
        );
    }

    /*selectFile(event){
        //this.selectedFiles = event.target.files;
        for(let file of event.files){
          this.selectedFiles.push(file);
      }
    }*/

    getUptimeContinueButton() {
        if (this.resizeAddDiskOnly || this.resizeWorkSpaceOnly) {
            return 'Next';
        }
        return 'Submit';
    }

    handleUptimeButtonClick() {
        if (this.resizeWorkSpaceOnly || this.resizeAddDiskOnly) {
            return this.handleResizeWorkNext(3);
        }
        return this.postResizeJSON();
    }

    handleResizeWorkNext(e) {
        /*

        ****Logic to navigate if need not hide tabs but disable based on manage selection****

        if (e === 1) {
            if (this.ManageBoth || this.resizeWorkSpaceOnly) {
                this.selectedIndexChange(1);
                return;
            } else if (!this.ManageBoth && !this.resizeWorkSpaceOnly) {
                this.selectedIndexChange(2);
                return;
            }
        } else if (e === 2) {
            if (this.ManageBoth || this.resizeAddDiskOnly) {
                this.selectedIndexChange(2);
            } else {
                this.selectedIndexChange(3);
            }
            return;
        }
        */
        if (this.selectedIndex === 0 && this.instanceState.toLowerCase().trim() === 'running') {
            this.snackBar.open('The instance will be stopped for size changes', 'close', {
                duration: 5000,
            });
        }
        console.log('handle resize next ');
        this.selectedIndexChange(this.selectedIndex + 1);
    }

    handlePricingSelection(instanceFamilyIndex, pricingGroupsIndex) {
        this.requestedInstanceType = this.pricingGroups[instanceFamilyIndex][pricingGroupsIndex]['instanceType'];
        this.vcpu = this.pricingGroups[instanceFamilyIndex][pricingGroupsIndex]['vcpu'];
        this.desiredMemory = this.pricingGroups[instanceFamilyIndex][pricingGroupsIndex]['memory'];
        this.desiredMemory = this.desiredMemory.length ? this.desiredMemory.split(' ')[0] : '';
    }

    hasPriceSelection() {
        if (this.requestedInstanceType) {
            return true;
        } else {
            return false;
        }
    }

    getTransformedPrice(cost) {
        return ('$' + (parseFloat(cost)).toFixed(2) + ' per hour');
    }

    getInstanceTypeToPrint(e) {
        if (e === 'Pricing List') {
            return 'Full List';
        }
        return e;
    }

    getTransformedMemory(memory) {
        return memory.split(' ')[0].concat(' GB');
    }

    transformPricing(pricingList) {
        this.pricingGroups = [];
        this.instanceFamilyList = [];
        let filteredPriceList = [];
        pricingList.map(e => {
            if (e.pricelist) {
                filteredPriceList = [...filteredPriceList, ...e.pricelist];
            }
        });
        let fileteredRecommendedInstanceFamilyList = [];
        pricingList.map(e => {
            if (e.recommendedlist) {
                fileteredRecommendedInstanceFamilyList = [...fileteredRecommendedInstanceFamilyList, ...e.recommendedlist];
            }
        });
        this.pricingGroups.push(fileteredRecommendedInstanceFamilyList);
        this.pricingGroups.push(filteredPriceList);
        this.instanceFamilyList.push('Recommended list');
        this.instanceFamilyList.push('Pricing List');
    }

    postResizeJSON() {
        const message = {};
        message['manageWorkstation'] = this.resizeWorkSpaceOnly && !this.resizeAddDiskOnly;
        message['manageDiskspace'] = !this.resizeWorkSpaceOnly && this.resizeAddDiskOnly;
        message['manageWorkStationAndDiskspace'] = this.resizeWorkSpaceOnly && this.resizeAddDiskOnly;
        message['manageUptimeAndWorkstation'] = this.scheduleUpTime;
        // message['manageAll'] = false;
        message['manageUptime'] = (this.scheduleUpTime);
        // message['manageUptimeAndDiskspace'] = false;
        // message['manageUptimeAndWorkstation'] = false;

        message['username'] = this.userName;
        message['user_email'] = this.userEmail;
        message['default_instance_type'] = this.defaultInstanceType;
        message['instance_id'] = this.instanceId;
        message['operating_system'] = this.operatingSystem;
        message['startAfterResize'] = this.startAfterResize;
        
        if (this.resizeWorkSpaceOnly) {
            message['workstation_schedule_from_date'] = this.workSpaceFromDate;
            message['workstation_schedule_to_date'] = this.workSpaceToDate;
            message['requested_instance_type'] = this.requestedInstanceType;
            message['vcpu'] = this.vcpu;
            message['memory'] = this.desiredMemory;
        }

        if (this.scheduleUpTime) {
            message['uptime_schedule_from_date'] = this.uptimeFromDate;
            message['uptime_schedule_to_date'] = this.uptimeToDate;
        }

        if (this.resizeAddDiskOnly) {
            // tslint:disable-next-line:radix
            this.volumeCount = (parseInt(this.volumeCount) + 1).toString();
            localStorage.setItem('volumeCount', this.volumeCount);
            localStorage.setItem('volumeCountLastModified', new Date().toString());
            this.shouldAllowManageVolume();
            message['volume'] = true;
            message['required_diskspace'] = this.diskSizeChange ? this.additionalDiskSpace : 0;
            message['diskspace_schedule_from_date'] = this.diskSpaceFromDate;
            message['diskspace_schedule_to_date'] = this.diskSpaceToDate;
        }
        this.didManageWorkStation['posted'] = true;
        this.didManageWorkStation['data'] = message;
        this.gatewayService.modifyUserWorkstation('manage_user_workstation?wsrequest=' + encodeURI(JSON.stringify(message))).subscribe(
            (response: any) => {
                // if (!this.resizeAddDiskOnly && !this.ManageBoth) {
                this.successHandler();
                // }
                console.log('Request Sent Successfully');
            },
            (error) => {
                this.failureHandler();
            }
        );
    }

    triggerManageWorkStationCallback() {
        if (this.resizeWorkSpaceOnly) {
            location.reload();
        }
    }

    successHandler() {
        setTimeout(() => {
            if (this.resizeWorkSpaceOnly) {
                location.reload();
            }
        }, 1000);
        this.snackBar.open('Your request has been sent successfully', 'close', {
            duration: 4000,
        });
        this.sendMail();
    }

    failureHandler() {
        this.snackBar.open('Oops Something went wrong, please try again.', 'close', {
            duration: 5000,
        });
        this.onNoClick();
    }

    setDisableCurrentConfigurations() {
        // "CPUs:2,Memory(GiB):4".split(",")[0].split(":")[1]
        this.currentConfiguration.split(',').forEach(i => {
            // tslint:disable-next-line:radix
            this.currentConfigurations.push(Number(i.split(':')[1]));
        });
    }

    getScheduleUptimeData() {
        const message = {username: this.userName, instance_id: this.instanceId};
      this.gatewayService.get('get_workstation_schedule?wsrequest=' + encodeURI(JSON.stringify(message))).subscribe(
        // this.gatewayService.get('get_workstation_schedule?username=' + this.userName).subscribe(
            (response: any) => {
                if (response['schedulelist'].some(e => e['uptime_instnace_id'] === this.instanceId)) {
                    this.disableUptimeOption = true;
                    this.schedulesOnInstance = response['schedulelist'];
                } else {
                    this.disableUptimeOption = false;
                }
            },
            error => {
                this.disableUptimeOption = false;
            }
        );
    }

    getUptimeDates () {
        const uptimeRequests = this.schedulesOnInstance.filter(e => e['uptime_instnace_id'] === this.instanceId);
        return `from ${uptimeRequests[0]['uptime_schedule_from_date']} to ${uptimeRequests[0]['uptime_schedule_to_date']}`;
    }

    getScheduleUptimeTooltip() {
        // tslint:disable-next-line:max-line-length
        return this.disableUptimeOption ? `Schedule Uptime is already requested on this instance ${this.getUptimeDates()}` : '';
    }

    handleResizeFilterFormSubmit() {
        // console.log(this.data.stack) configuration
        this.callResolved = false;
        this.resizeFilterFormSubmitted = true;
        this.requestedInstanceType = undefined;
        this.selectedCpu = this.resize.cpu;
        this.selectedMemory = this.resize.memory;
        // tslint:disable-next-line:max-line-length
        this.gatewayService.getDesiredInstanceTypesAndCosts('get_desired_instance_types?cpu=' + this.selectedCpu + '&memory=' + this.selectedMemory + '&os=' + this.operatingSystem).subscribe(
            (response: any) => {
                console.log(response);
                this.pricing = response;
                this.transformPricing(this.pricing);
                this.callResolved = true;
                // this.snackBar.open('Your request has been sent successfully', 'close', {
                //     duration: 2000,
                // });
                // this.onNoClick();
                console.log('Access Request Sent Successfully');
            }
        );
    }

    getTabHeading() {
        if (this.resizeWorkSpaceOnly && !this.resizeAddDiskOnly && !this.scheduleUpTime) {
            if (this.selectedIndex === 0) {
                return `Manage Workstation`;
            } else if (this.selectedIndex === 1) {
                return 'Resize Workstation';
            } else if (this.selectedIndex === 2) {
                return 'Select schedule';
            } else {
                return 'Resize Workstation';
            }
        }
        if (!this.resizeWorkSpaceOnly && this.resizeAddDiskOnly && !this.scheduleUpTime) {
            if (this.selectedIndex === 0) {
                return `Manage Workstation`;
            } else if (this.selectedIndex === 1) {
                return 'Additional Diskspace';
            } else if (this.selectedIndex === 2) {
                return 'Select schedule';
            } else {
                return 'Resize Workstation';
            }
        }
        if (!this.resizeWorkSpaceOnly && !this.resizeAddDiskOnly && this.scheduleUpTime) {
            if (this.selectedIndex === 0) {
                return `Manage Workstation`;
            } else if (this.selectedIndex === 1) {
                return 'Uptime schedule';
            } else {
                return 'Resize Workstation';
            }
        }
        if (this.resizeWorkSpaceOnly && this.resizeAddDiskOnly && !this.scheduleUpTime) {
            if (this.selectedIndex === 0) {
                return `Manage Workstation`;
            } else if (this.selectedIndex === 1) {
                return 'Resize Workstation';
            } else if (this.selectedIndex === 2) {
                return 'Additional Diskspace';
            } else if (this.selectedIndex === 3) {
                return 'Select schedule';
            } else {
                return 'Resize Workstation';
            }
        }
        if (this.resizeWorkSpaceOnly && !this.resizeAddDiskOnly && this.scheduleUpTime) {
            if (this.selectedIndex === 0) {
                return `Manage Workstation`;
            } else if (this.selectedIndex === 1) {
                return 'Resize Workstation';
            } else if (this.selectedIndex === 2) {
                return 'Uptime schedule';
            } else if (this.selectedIndex === 3) {
                return 'Select schedule';
            } else {
                return 'Resize Workstation';
            }
        }
        if (!this.resizeWorkSpaceOnly && this.resizeAddDiskOnly && this.scheduleUpTime) {
            if (this.selectedIndex === 0) {
                return `Manage Workstation`;
            } else if (this.selectedIndex === 1) {
                return 'Uptime schedule';
            } else if (this.selectedIndex === 2) {
                return 'Additional Diskspace';
            } else if (this.selectedIndex === 3) {
                return 'Select schedule';
            } else {
                return 'Resize Workstation';
            }
        }
        if (this.resizeWorkSpaceOnly && this.resizeAddDiskOnly && this.scheduleUpTime) {
            if (this.selectedIndex === 0) {
                return `Manage Workstation`;
            } else if (this.selectedIndex === 1) {
                return 'Resize Workstation';
            } else if (this.selectedIndex === 3) {
                return 'Additional Diskspace';
            } else if (this.selectedIndex === 2) {
                return 'Uptime schedule';
            } else if (this.selectedIndex === 4) {
                return 'Select schedule';
            } else {
                return 'Resize Workstation';
            }
        }
        if (this.selectedIndex === 0) {
            return `Manage Workstation`;
        } else if (this.selectedIndex === 1) {
            return 'Resize Workstation';
        } else if (this.selectedIndex === 2) {
            return 'Additional Diskspace';
        } else if (this.selectedIndex === 3) {
            return 'Select schedule';
        } else {
            return 'Resize Workstation';
        }
    }

    submitRequest() {
        // alert(this.trustedAcceptableUse);
        this.selectedDataSet = this.messageModel.datasettype;
        this.selectedDataProvider = this.messageModel.dataProviderName;
        this.selectedDatatype = this.messageModel.subDataSet;

        console.log(this.userBucketName);

        const approvalForm = {};

        if (this.selectedDataSet) {
            approvalForm['datasetName'] = this.selectedDataSet;
        }
        if (this.derivedDataSetName) {
            approvalForm['derivedDataSetname'] = this.derivedDataSetName;
        }
        if (this.selectedDataProvider) {
            approvalForm['dataprovider'] = this.selectedDataProvider;
        }
        if (this.selectedDatatype) {
            approvalForm['datatype'] = this.selectedDatatype;
        }
        if (this.dataSources) {
            approvalForm['datasources'] = this.dataSources;
        }
        if (this.derivedDataSet) {
            approvalForm['deriveddataset'] = this.derivedDataSet;
        }
        if (this.detailedDerivedDataset) {
            approvalForm['detailedderiveddataset'] = this.detailedDerivedDataset;
        }
        if (this.tags) {
            approvalForm['tags'] = this.tags;
        }
        if (this.justifyExport) {
            approvalForm['justifyExport'] = this.justifyExport;
        }
        // Submit API gateway request
        const reqBody = {};
        // reqBody['S3KeyHash'] = this.messageModel.fileFolderName;//Md5.hashStr('');//add s3 key inside
        reqBody['RequestedBy_Epoch'] = new Date().getTime();
        // reqBody['DataSet_DataProvider_Datatype'] = this.selectedDataSet + "-" + this.selectedDataProvider + "-" + this.selectedDatatype;
        reqBody['ReqReceivedtimestamp'] = null;
        reqBody['RequestedBy'] = null;
        reqBody['WorkflowStatus'] = null;
        reqBody['RequestReviewStatus'] = 'Submitted';
        reqBody['RequestReviewedBy'] = null;
        reqBody['ReqReviewTimestamp'] = null;
        reqBody['S3Key'] = this.messageModel.fileFolderName;
        reqBody['TeamBucket'] = this.userBucketName; // check this
        reqBody['RequestID'] = null;
        reqBody['ApprovalForm'] = approvalForm;
        reqBody['UserID'] = this.userName;
        reqBody['selectedDataInfo'] = { 'selectedDataSet': this.selectedDataSet, 'selectedDataProvider': this.selectedDataProvider, 'selectedDatatype': this.selectedDatatype };
        reqBody['acceptableUse'] = this.acceptableUse;
        /*if(this.trustedRequest === "Yes" && (this.acceptableUse === "No" || this.acceptableUse == "")) {
            //alert("Usage policy to continue"); // Ribbon...
            this.snackBar.open('Acceptable use policy should be accepted to request trusted status', 'close', {
                duration: 2000,
            });
        } else { */
        if (this.trustedRequest === 'Yes') {
            // Submit API gateway request
            reqBody['trustedRequest'] = { 'trustedRequestStatus': 'Submitted' };
        }
        // ***If the acceptable policy is Decline and the user has asked for trusted status: we should ignore the entry and not even store in dynamodb
        if (this.trustedRequest === 'Yes' && this.acceptableUse === 'Decline') {
            console.log('Declined acceptable usage policy');
            reqBody['trustedRequest'] = { 'trustedRequestStatus': 'Untrusted' };
            reqBody['RequestReviewStatus'] = 'Rejected';
        }
        if (this.trustedRequest === 'No' && this.acceptableUse === 'Decline') {
            console.log('Declined acceptable usage policy');
            reqBody['RequestReviewStatus'] = 'Rejected';
        }
        this.gatewayService.sendExportRequest('export?message=' + encodeURI(JSON.stringify(reqBody))).subscribe(
            (response: any) => {
                this.snackBar.open('Your request has been sent successfully', 'close', {
                    duration: 2000,
                });
                this.onNoClick();
                console.log('Request Sent Successfully');
            }
        );
        // }
    }

    onTrustedRequestGrpChange(selectedVal: any) {
        // if(selectedVal === "No") {
        // //  this.trustedAcceptableUseDisabled = true;
        // //  this.acceptableUse = "Decline";
        //     this.trustedRequest =  "No";
        // } else {
        //     // this.trustedAcceptableUseDisabled = false;
        //     // this.acceptableUse = "Accept";
        //     this.trustedRequest =  "Yes";
        // }
        if (selectedVal === 'Yes') {
            this.trustedRequest = 'Yes';
        }
    }

    uploadFiles(event1) {
        const totalFilesCount = event1.files.length;
        for (const file of event1.files) {

            console.log('Bucket name is = ' + this.userBucketName);
            console.log('File name is = ' + file.name);
            this.gatewayService.getPresignedUrl('presigned_url?file_name=' + file.name + '&file_type=' + file.type + '&bucket_name=' + this.userBucketName + '&username=' + this.userName).subscribe(
                (response: any) => {

                    const req = new HttpRequest('PUT', response, file, {
                        reportProgress: true,
                        headers: new HttpHeaders().set('Content-Type', file.type)
                    });

                    this.http.request(req).subscribe(event => {
                        // Via this API, you get access to the raw event stream.
                        // Look for upload progress events.
                        if (event.type === HttpEventType.UploadProgress) {
                            // This is an upload progress event. Compute and show the % done:
                            const percentDone = Math.round(100 * event.loaded / event.total);
                            this.fileUpload.progress = percentDone;
                            console.log('File is ${percentDone}% uploaded.', percentDone);
                        } else if (event instanceof HttpResponse) {
                            this.selectedFiles.push(file);
                            event1.files.forEach((file1, index) => {
                                if (file1.name === file.name) {
                                    this.fileUpload.remove(event1.files, index);
                                }
                            });
                            this.uploadedFilesCount++;
                            console.log('File is completely uploaded!');
                            if (this.uploadedFilesCount === totalFilesCount) {
                                this.snackBar.open('Your file(s) has been uploaded successfully', 'close', {
                                    duration: 2000,
                                });
                                this.onNoClick();
                            }
                        }
                    });
                }
            );
        }
    }


}
