import { Component, Inject, OnInit, ViewChild } from "@angular/core"; //child to parent data sharing via ViewChild
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpEventType,
  HttpResponse,
} from "@angular/common/http";
import { FileUpload, FileUploadModule } from "primeng/fileupload";
//import { MAT_DIALOG_DATA, MatDialogRef, MatTooltipModule, MatSnackBar, MatDatepicker, MatRadioModule, MatCheckboxModule, MatTabsModule } from '@angular/material';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
//import {MatTooltipModule} from '@angular/material/tooltip'
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
//import { MatRadioModule } , from '@angular/material/radio';
//import { MatCheckboxModule } from '@angular/material/checkbox';
//import { MatTabsModule } from '@angular/material/tabs';
//import { MatDatepicker }  from '@angular/material/datepicker';

import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from "primeng/checkbox";
import { ApiGatewayService } from "../../../services/apigateway.service";
import { Router } from "@angular/router";
import { CommonModule, Location } from "@angular/common";
import { DialogModule } from "@angular/cdk/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule, MatHint } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import {
  MatExpansionModule,
  MatExpansionPanel,
} from "@angular/material/expansion";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCardModule } from "@angular/material/card";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { MatIconModule } from "@angular/material/icon";
import { DatasetsComponent } from "../datasets/datasets.component";
import {
  MatCommonModule,
  MatLineModule,
  MatNativeDateModule,
} from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CdkTableModule } from "@angular/cdk/table";
import { TableModule } from "primeng/table";
import { PanelModule } from "primeng/panel";
import { RadioButtonModule } from "primeng/radiobutton";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CdkTableModule,
    RadioButtonModule,
    TableModule,
    FileUploadModule,
    InputTextModule,
    DialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatRadioModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatSnackBarModule,
    CheckboxModule,
    FormsModule,
    CardModule,
    ButtonModule,
    PanelModule,
    FileUploadModule,
  ],
  selector: "app-dialog-box",
  templateUrl: "./dialog-box.component.html",
  styleUrls: ["./dialog-box.component.css"],
})
export class DialogBoxComponent implements OnInit {
  // protected options: RequestOptions;
  fileName: string;
  mailType: string;
  requestType: string; //requestType variable is param for "request to upload data to s3 bucket" vs. other dialogs have  mailType
  exportRequestType: string;
  userBucketName: string;
  // selectedFiles: FileList;
  //selectedFiles: any[] = [];
  message: string;
  datasetName: string;
  userEmail: string;
  userName: string;
  showDataset: boolean;
  showAlgorithm: boolean;
  uploadedFilesCount = 0;
  selectedIndex = 0;
  userTrustedStatus: any;
  userAutoExportStatus: any;
  datasettype: string;
  selectedDataSet: string;
  selectedDataProvider: string;
  selectedDatatype: string;
  datasources: string;
  myDatasets: any = [];
  detailedderiveddataset: string;
  autoderiveddataset: string;
  autoreason: string;
  // tags: string;
  upload_locations: any = [];
  justifyExport: string;
  trustedStatus: boolean;
  autoExportStatus: boolean;
  exportWorkflow: any;
  expWorkflow: any;
  derivedDataSetname: string;
  dataprovider: string;
  datatype: string;
  export: any[] = [];
  allProvidersJson: any;
  allDataTypes: any;
  trustedRequest: string;
  trustedUserJustification: string;
  autoExportRequest: string;
  autoExportRequestSelected: boolean;
  acceptableUse: string;
  acceptableUseTUSR = false;
  approvalForm: string;
  dataType: string;
  dataSources: string;
  detailedDerivedDataset: string;
  derivedDataSetName: string;
  trustedAcceptableUseDisabled: boolean;
  edgePrivateDatabase: string;
  edgePrivateTable: string;
  edgeTableRequestButtonLabel: string;
  uploadNotice = false;
  resizeFilterFormSubmitted = false;
  locations: string[] = ["Location A", "Location B", "Location C"];

  diskSizeChange = true;
  cpuOptions = [2, 4, 8, 16, 24, 36, 40, 48, 60, 64, 72, 96, 128];
  memoryOptions = [
    2, 3.75, 4, 5.25, 7.5, 8, 10.5, 15, 15.25, 16, 21, 30, 30.5, 32, 42, 61, 64,
    72, 96, 128, 144, 160, 192, 256, 384, 768,
  ];
  // eslint-disable-next-line max-len
  additionalDiskSizeOptions = [
    2, 3.75, 4, 5.25, 7.5, 8, 10.5, 15, 15.25, 16, 21, 30, 30.5, 32, 42, 61, 64,
    72, 96, 128, 144, 160, 192, 256, 384, 768,
  ];
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
  additionalDiskSpace = "";
  @ViewChild("fileUpload") fileUpload: FileUpload;

  dataTypes = [
    { value: "dataset", viewValue: "Dataset" },
    { value: "algorithm", viewValue: "Algorithm" },
  ];

  Categories = [
    { value: "raw", viewValue: "Raw" },
    { value: "curated", viewValue: "Curated" },
    { value: "published", viewValue: "Published" },
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
  instanceState = "";

  dataProviderNames = [];
  subDataSets = [];
  //subDataSetsWydot = [];
  currentConfigurations = [];
  vcpu = "";
  desiredMemory = "";
  blockVolumeManage = false;
  startAfterResize = false;
  didManageWorkStation = { posted: false, data: {} };
  disableUptimeOption = false;
  schedulesOnInstance = [];
  currentConfiguration = "";

  // cvPilotDataSets:string[] = new Array("Wyoming","Tampa Hillsborough Expressway Authority","New York City DOT","All Sites")

  messageModel = {
    name: "",
    stateList: "",
    dotEmployee: "",
    dotEmployeeEmail: "",
    dotEmployeeExistingContract: "",
    fileFolderName: "",
    type: "dataset",
    category: "",
    bucketName: "",
    description: "",
    readmeFileName: "",
    geographicScope: "",
    dataAvailability: "",
    ProgrammingTool: "",
    //isCVPilotTeamMember: '',
    // cvPilotTeamName: '',
    //isCVPilotIETMember: '',
    //accessReason: '',
    //cvPilotDataSets: '',
    datasettype: "",
    selectedDataSet: "",
    dataProviderName: "",
    subDataSet: "",
    datasources: "",
    detailedderiveddataset: "",
    // tags: '',
    justifyExport: "",
    derivedDatasetname: "",
    dataprovider: "",
    datatype: "",
    autoderiveddataset: "",
    autoreason: "",
    trustedUserJustification: "",
    edgePrivateDatabase: "",
    edgePrivateTable: "",
  };

  resize = {
    cpu: "",
    memory: "",
    defaultInstanceType: "",
    operatingSystem: "",
  };

  currentStack = {};
  states = {};
  volumeCount = "";

  // eslint-disable-next-line max-len
  constructor(
    private gatewayService: ApiGatewayService,
    private router: Router,
    private location: Location,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.messageModel.bucketName = data.bucketName;
    this.mailType = data.mailType;
    this.datasetName = data.datasetName;
    this.messageModel.fileFolderName = data.datasetName;
    this.requestType = data.requestType;
    this.userBucketName = data.userBucketName;
    this.datasettype = data.datasettype;
    this.trustedRequest = "No";
    this.autoExportRequest = "No";
    this.autoExportRequestSelected = false;
    this.autoderiveddataset = "";
    this.autoreason = "";
    this.trustedUserJustification = "";
    this.groupFoldersAndFiles(this.myDatasets);
    this.edgePrivateDatabase = "";
    this.edgePrivateTable = "";
    this.edgeTableRequestButtonLabel = "SUBMIT";
    this.acceptableUse = "";
    this.trustedAcceptableUseDisabled = false;
    this.approvalForm = data.approvalForm;
    this.operatingSystem = data.stack && data.stack.operating_system;
    this.defaultInstanceType = data.stack && data.stack.instance_type;
    this.instanceId = data.stack && data.stack.instance_id;
    this.currentConfiguration = data.stack && data.stack.current_configuration;
    this.currentStack = data.stack;
    this.states = data.states;
    this.uploadNotice = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log(
      "constructor this.edgePrivateDatabase:" + this.edgePrivateDatabase
    );

    this.userEmail = sessionStorage.getItem("email");
    this.userName = sessionStorage.getItem("username");
    this.edgePrivateDatabase = sessionStorage.getItem("teamSlug");
    this.messageModel.edgePrivateDatabase = this.edgePrivateDatabase;
    console.log("edgePrivateDatabase:" + this.edgePrivateDatabase);
    this.mailType === "reSize Request" &&
      this.setDisableCurrentConfigurations();
    const trustedStatus = sessionStorage.getItem("userTrustedStatus");
    this.userTrustedStatus = JSON.parse(trustedStatus);
    const autoExportStatus = sessionStorage.getItem("userAutoExportStatus");
    var upload_locations_string = sessionStorage.getItem("upload_locations");
    this.upload_locations = JSON.parse(upload_locations_string);
    this.userAutoExportStatus = JSON.parse(autoExportStatus);
    const expWorkflow = sessionStorage.getItem("exportWorkflow");
    this.expWorkflow = JSON.parse(expWorkflow);

    this.exportWorkflow = JSON.parse(sessionStorage.getItem("datasets"));
    for (let i = 0; i < this.exportWorkflow.length; i++) {
      const exportW = this.exportWorkflow[i];
      this.export.push(exportW.exportWorkflow);
    }
    const datasets = [];
    for (let j = 0; j < this.export.length; j++) {
      if (this.export[j]) {
        const dataset = {};
        dataset["value"] = Object.keys(this.export[j])[0];
        dataset["viewValue"] = Object.keys(this.export[j])[0];
        this.dataSetTypes.push(dataset);
        // datasets.push(Object.keys(this.export[j]));
      }
    }
    console.log(this.dataSetTypes);
    if (this.mailType === "reSize Request") {
      this.instanceState = this.states[this.instanceId];
      // let exportWorkflow = sessionStorage.getItem('exportWorkflow');
      // this.exportWorkflow = JSON.parse(exportWorkflow);
      this.getScheduleUptimeData();
      //this.shouldAllowManageVolume();
    }

    this.getUploadLocations();
  }

  shouldAllowManageVolume() {
    // Disable add disk space feature if user has already did 2 or more increase disk-space requests in last 1 hour.
    if (localStorage.getItem("volumeCountLastModified")) {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line radix
      this.volumeCount = localStorage.getItem("volumeCount")
        ? (parseInt(localStorage.getItem("volumeCount")) + 0).toString()
        : "0";
      // eslint-disable-next-line radix
      const currentDate = Date.parse(new Date().toString());
      // eslint-disable-next-line radix
      const lastUpdatTime = Date.parse(
        localStorage.getItem("volumeCountLastModified")
      );
      if ((currentDate - lastUpdatTime) / 1000 / 60 / 60 < 1) {
        // eslint-disable-next-line radix
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
          dataProvider["value"] = Object.keys(this.allProvidersJson)[j];
          dataProvider["viewValue"] = Object.keys(this.allProvidersJson)[j];
          this.dataProviderNames.push(dataProvider);
        }
      }
    }
  }

  getUploadLocations() {
    this.upload_locations.forEach((location) => {
      console.log("Location ==", location, this.upload_locations[location]);
      console.log(
        "getUploadLocations called: get URL = " +
          location +
          "&username=" +
          this.userName
      );
      this.gatewayService
        .get(
          "user_data?userBucketName=" + location + "&username=" + this.userName
        )
        .subscribe((response: any) => {
          for (let x of response) {
            this.myDatasets.push({
              filename: x,
            });
          }
          console.log("My Datasets: " + JSON.stringify(this.myDatasets));
          console.log("my Datasets length = " + this.myDatasets.length);
        });
    });
  }

  userBucketNameFiltered: any[];

  filterUserBucketName() {
    this.userBucketNameFiltered = this.myDatasets.filter(
      (item) => item.filename && item.filename.trim() !== ""
    );
  }

  isFolder(location) {
    return location.endsWith("/");
  }
  selectedSubmenu: string[] = [];

  updateSubmenu(location: string) {
    this.selectedSubmenu = this.myDatasets.filter((file) =>
      this.isSubmenuItem(file, location)
    );
  }

  isSubmenuItem(file: string, location: string): boolean {
    return file.startsWith(location) && file !== location && file.endsWith("/");
  }

  isEmptyBullet(str: string): boolean {
    return str === null || str.trim() === "";
  }

  hasSubMenuItems(selectedLocation: string): boolean {
    // Use the selectedLocation to determine if there are sub-menu items
    // Return true if there are items, or false if there are none
    return this.myDatasets.some(
      (item) =>
        item.filename.startsWith(selectedLocation) &&
        item.filename !== selectedLocation
    );
  }
  folders: string[] = [];
  files: string[] = [];

  groupFoldersAndFiles(elements) {
    console.log("ELEMENTS == ", elements);
    for (let i = 0; i < elements.length; i++) {
      const filename = elements[i].filename;
      console.log(`Filename ${i + 1}: ${filename}`);
      this.folders = elements[i].filter((location) => location.endsWith("/"));
      this.files = elements[i].filter((location) => !location.endsWith("/"));
    }
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
        dataType["value"] = Object.keys(allDataTypesForProvider)[j];
        dataType["viewValue"] = Object.keys(allDataTypesForProvider)[j];
        this.subDataSets.push(dataType);
      }
    }
  }

  selectedIndexChange(val: number) {
    console.log("--- ", val, " ---");
    this.selectedIndex = val;
  }

  onSelectionOfDataset() {
    this.selectedDataSet = this.messageModel.datasettype;
    this.selectedDataProvider = this.messageModel.dataProviderName;
    this.selectedDatatype = this.messageModel.subDataSet;
    console.log("SelectedDataType:" + this.selectedDatatype);
    const key =
      this.selectedDataSet +
      "-" +
      this.selectedDataProvider +
      "-" +
      this.selectedDatatype;
    this.trustedStatus = key in this.userTrustedStatus;
    this.autoExportStatus = key in this.userAutoExportStatus;
    this.trustedRequest = "No";
    this.autoExportRequest = "No";
    this.autoExportRequestSelected = false;
    this.autoderiveddataset = "";
    this.autoreason = "";
    this.acceptableUse = "";
    this.selectedIndex = 1;
  }

  onApprovalformClick() {
    this.selectedDataSet = this.messageModel.datasettype;
    this.selectedDataProvider = this.messageModel.dataProviderName;
    this.selectedDatatype = this.messageModel.subDataSet;
    this.derivedDataSetName = this.messageModel.derivedDatasetname;
    this.detailedDerivedDataset = this.messageModel.detailedderiveddataset;
    this.dataType = this.messageModel.datatype;
    this.dataSources = this.messageModel.datasources;
    // this.tags = this.messageModel.tags;
    this.justifyExport = this.messageModel.justifyExport;
    this.selectedIndex = 2;
    console.log(this.selectedIndex);
  }

  onPreviousBtnClick() {
    if (this.selectedIndex >= 1) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  validateEmailRegex(email) {
    const regexEmail = new RegExp(
      "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
    );
    return regexEmail.test(email);
  }

  sendMail() {
    if (
      this.mailType === "Access Request Mail" &&
      this.datasetName !==
        "U.S DOT Connected Vehicle Pilot (CVP) Evaluation Datasets"
    ) {
      this.message =
        "<div>" +
        "    Hello,<br><br>" +
        "    Please approve the request for Dataset Access.<br>" +
        "    <ul>" +
        "        <li>Dataset Name = " +
        this.datasetName +
        "</li>" +
        "        <li>Bucket Name = " +
        this.messageModel.bucketName +
        "</li>" +
        "        <li>User is a USDOT employee or researcher = " +
        this.messageModel.dotEmployee +
        "</li> <br>" +
        "        <li>USDOT employee email address = " +
        this.messageModel.dotEmployeeEmail +
        "</li> <br>" +
        "        <li>User has a data agreement with the provider = " +
        this.messageModel.dotEmployeeExistingContract +
        "</li> <br>" +
        "        <li>State List = " +
        this.messageModel.stateList +
        "</li> <br>" +
        "        <li>Sender Name = " +
        this.userName +
        "</li>" +
        "        <li>Sender E-mail id = " +
        this.userEmail +
        "</li>" +
        "    </ul>" +
        "    Thanks, <br>" +
        this.userName +
        "</div>";
    } else {
      // if (this.mailType === 'Access Request Mail' && this.datasetName === 'U.S DOT Connected Vehicle Pilot (CVP) Evaluation Datasets') {
      //     this.message = '<div>' +
      //         '    Hello,<br><br>' +
      //         '    Please approve the request for Dataset Access.<br>' +
      //         '    <ul>' +
      //         '        <li>Dataset Name = ' + this.datasetName + '</li>' +
      //         '        <li>Bucket Name = ' + this.messageModel.bucketName + '</li>' +
      //         '        <li>User is a member of either the NYC, THEA or Wyoming CV Pilot Team? = ' + this.messageModel.isCVPilotTeamMember + '</li> <br>' +
      //         '        <li>User is affiliated with CV Pilot Team = ' + this.messageModel.cvPilotTeamName + '</li> <br>' +
      //         '        <li>User is a member of the CV Pilot Independent Evaluation Team? = ' + this.messageModel.isCVPilotIETMember + '</li> <br>' +
      //         '        <li>User is requesting data access to CV Pilot datasets = ' + this.messageModel.cvPilotDataSets + '</li> <br>' +
      //         '        <li>Reason for data access request to CV Pilot datasets = ' + this.messageModel.accessReason + '</li> <br>' +
      //         '        <li>Sender Name = ' + this.userName + '</li>' +
      //         '        <li>Sender E-mail id = ' + this.userEmail + '</li>' +
      //         '    </ul>' +
      //         '    Thanks, <br>' + this.userName +
      //         '</div>';
      // } else
      if (this.messageModel.type === "dataset") {
        this.message =
          "<div> Hello,<br><br>Please approve the request for publishing the datasets.<br>" +
          "    <ul>" +
          "        <li>Dataset / Algorithm Name = " +
          this.datasetName +
          "</li>" +
          "        <li>Type = " +
          this.messageModel.type +
          "</li>" +
          "        <li>Category = " +
          this.messageModel.category +
          "</li>" +
          "        <li>File Name = " +
          this.messageModel.name +
          "</li>" +
          "        <li>Description = " +
          this.messageModel.description +
          "</li>" +
          "        <li>Readme / Data dictionary file name = " +
          this.messageModel.readmeFileName +
          "</li>" +
          "        <li>Geographic Scope = " +
          this.messageModel.geographicScope +
          "</li>" +
          "        <li>Start/End Date for Data Availability = " +
          this.messageModel.dataAvailability +
          "</li> <br>" +
          "        <li>Sender Name = " +
          this.userName +
          "</li>" +
          "        <li>Sender E-mail id = " +
          this.userEmail +
          "</li>" +
          "    </ul>" +
          "    Thanks, <br>" +
          this.userName +
          "</div>";
      } else if (this.messageModel.type === "algorithm") {
        this.message =
          "<div> Hello,<br><br>Please approve the request for publishing the datasets.<br>" +
          "    <ul>" +
          "        <li>Dataset / Algorithm Name = " +
          this.datasetName +
          "</li>" +
          "        <li>Type = " +
          this.messageModel.type +
          "</li>" +
          "        <li>File Name = " +
          this.messageModel.name +
          "</li>" +
          "        <li>Description = " +
          this.messageModel.description +
          "</li>" +
          "        <li>Readme / Data dictionary file name = " +
          this.messageModel.readmeFileName +
          "</li>" +
          "        <li>Programming Tools/language = " +
          this.messageModel.ProgrammingTool +
          "</li>  <br>" +
          "        <li>Sender Name = " +
          this.userName +
          "</li>" +
          "        <li>Sender E-mail id = " +
          this.userEmail +
          "</li>" +
          "    </ul>" +
          "    Thanks, <br>" +
          this.userName +
          "</div>";
      }
    }
    this.gatewayService
      .sendRequestMail(
        "send_email?sender=" + this.userEmail + "&message=" + this.message
      )
      .subscribe((response: any) => {
        this.snackBar.open("Your request has been sent successfully", "close", {
          duration: 2000,
        });
        if (
          this.didManageWorkStation["posted"] &&
          this.didManageWorkStation["data"]["manageWorkstation"]
        ) {
          this.triggerManageWorkStationCallback();
        }
        this.onNoClick();

        console.log("Access Request Sent Successfully");
      });
  }

  /*selectFile(event){
        //this.selectedFiles = event.target.files;
        for(let file of event.files){
          this.selectedFiles.push(file);
      }
    }*/

  getUptimeContinueButton() {
    if (this.resizeAddDiskOnly || this.resizeWorkSpaceOnly) {
      return "Next";
    }
    return "Submit";
  }

  handleUptimeButtonClick() {
    if (this.resizeWorkSpaceOnly || this.resizeAddDiskOnly) {
      return this.handleResizeWorkNext(3);
    }
    return this.postResizeJSON();
  }

  handleResizeWorkNext(e) {
    console.log(
      "HandleResizeWorkNext Called - this.selectedIndex == ",
      this.selectedIndex
    );
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
    if (
      this.selectedIndex === 0 &&
      this.instanceState.toLowerCase().trim() === "running"
    ) {
      this.snackBar.open(
        "The instance will be stopped for size changes",
        "close",
        {
          duration: 5000,
        }
      );
    }
    console.log("handle resize next ");
    this.selectedIndexChange(this.selectedIndex + 1);
    console.log("this.selectedIndex: ", this.selectedIndex);
  }

  handlePricingSelection(instanceFamilyIndex, pricingGroupsIndex) {
    this.requestedInstanceType =
      this.pricingGroups[instanceFamilyIndex][pricingGroupsIndex][
        "instanceType"
      ];
    this.vcpu =
      this.pricingGroups[instanceFamilyIndex][pricingGroupsIndex]["vcpu"];
    this.desiredMemory =
      this.pricingGroups[instanceFamilyIndex][pricingGroupsIndex]["memory"];
    this.desiredMemory = this.desiredMemory.length
      ? this.desiredMemory.split(" ")[0]
      : "";
  }

  hasPriceSelection() {
    if (this.requestedInstanceType) {
      return true;
    } else {
      return false;
    }
  }

  getTransformedPrice(cost) {
    return "$" + parseFloat(cost).toFixed(2) + " per hour";
  }

  getInstanceTypeToPrint(e) {
    if (e === "Pricing List") {
      return "Full List";
    }
    return e;
  }

  getTransformedMemory(memory) {
    return memory ? memory.split(" ")[0].concat(" GB") : "";
  }

  isValidIntanceTypeOption(item) {
    const requiredKeys = [
      "cost",
      "instanceFamily",
      "instanceType",
      "memory",
      "operatingSystem",
      "storage",
      "vcpu",
    ];
    const currentKeys = Object.keys(item);
    let validPriceCollection = true;
    requiredKeys.forEach((i) => {
      if (!currentKeys.includes(i)) {
        validPriceCollection = false;
      }
    });
    return validPriceCollection;
  }

  transformPricing(pricingList) {
    this.pricingGroups = [];
    this.instanceFamilyList = [];
    let filteredPriceList = [];
    pricingList.map((e) => {
      if (e.pricelist) {
        filteredPriceList = [...filteredPriceList, ...e.pricelist];
      }
    });
    let fileteredRecommendedInstanceFamilyList = [];
    pricingList.map((e) => {
      if (e.recommendedlist) {
        fileteredRecommendedInstanceFamilyList = [
          ...fileteredRecommendedInstanceFamilyList,
          ...e.recommendedlist,
        ];
      }
    });
    this.pricingGroups.push(fileteredRecommendedInstanceFamilyList);
    this.pricingGroups.push(filteredPriceList);
    this.instanceFamilyList.push("Recommended list");
    this.instanceFamilyList.push("Pricing List");
  }

  postResizeJSON() {
    const message = {};
    message["manageWorkstation"] =
      this.resizeWorkSpaceOnly && !this.resizeAddDiskOnly;
    message["manageDiskspace"] =
      !this.resizeWorkSpaceOnly && this.resizeAddDiskOnly;
    message["manageWorkStationAndDiskspace"] =
      this.resizeWorkSpaceOnly && this.resizeAddDiskOnly;
    message["manageUptimeAndWorkstation"] = this.scheduleUpTime;
    // message['manageAll'] = false;
    message["manageUptime"] = this.scheduleUpTime;
    // message['manageUptimeAndDiskspace'] = false;
    // message['manageUptimeAndWorkstation'] = false;

    message["username"] = this.userName;
    message["user_email"] = this.userEmail;
    message["default_instance_type"] = this.defaultInstanceType;
    message["instance_id"] = this.instanceId;
    message["operating_system"] = this.operatingSystem;
    message["startAfterResize"] = this.startAfterResize;

    if (this.resizeWorkSpaceOnly) {
      message["workstation_schedule_from_date"] = this.workSpaceFromDate;
      message["workstation_schedule_to_date"] = this.workSpaceToDate;
      message["requested_instance_type"] = this.requestedInstanceType;
      message["vcpu"] = this.vcpu;
      message["memory"] = this.desiredMemory;
    }

    if (this.scheduleUpTime) {
      message["uptime_schedule_from_date"] = this.uptimeFromDate;
      message["uptime_schedule_to_date"] = this.uptimeToDate;
    }

    if (this.resizeAddDiskOnly) {
      // eslint-disable-next-line radix
      this.volumeCount = (parseInt(this.volumeCount) + 1).toString();
      localStorage.setItem("volumeCount", this.volumeCount);
      localStorage.setItem("volumeCountLastModified", new Date().toString());
      this.shouldAllowManageVolume();
      message["volume"] = true;
      message["required_diskspace"] = this.diskSizeChange
        ? this.additionalDiskSpace
        : 0;
      message["diskspace_schedule_from_date"] = this.diskSpaceFromDate;
      message["diskspace_schedule_to_date"] = this.diskSpaceToDate;
    }
    this.didManageWorkStation["posted"] = true;
    this.didManageWorkStation["data"] = message;
    this.gatewayService
      .modifyUserWorkstation(
        "manage_user_workstation?wsrequest=" +
          encodeURI(JSON.stringify(message))
      )
      .subscribe(
        (response: any) => {
          // if (!this.resizeAddDiskOnly && !this.ManageBoth) {
          this.successHandler();
          // }
          console.log("Request Sent Successfully");
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
      } else {
        this.onNoClick();
      }
    }, 1000);
    this.snackBar.open("Your request has been sent successfully", "close", {
      duration: 4000,
    });
  }

  failureHandler() {
    this.snackBar.open(
      "Oops Something went wrong, please try again.",
      "close",
      {
        duration: 5000,
      }
    );
    this.onNoClick();
  }

  setDisableCurrentConfigurations() {
    // "CPUs:2,Memory(GiB):4".split(",")[0].split(":")[1]
    this.currentConfiguration.split(",").forEach((i) => {
      // eslint-disable-next-line radix
      this.currentConfigurations.push(Number(i.split(":")[1]));
    });
  }

  getScheduleUptimeData() {
    const message = { username: this.userName, instance_id: this.instanceId };
    this.gatewayService
      .get(
        "get_workstation_schedule?wsrequest=" +
          encodeURI(JSON.stringify(message))
      )
      .subscribe(
        // this.gatewayService.get('get_workstation_schedule?username=' + this.userName).subscribe(
        (response: any) => {
          if (
            response["schedulelist"].some(
              (e) => e["uptime_instnace_id"] === this.instanceId
            )
          ) {
            this.schedulesOnInstance = response["schedulelist"];
          } else {
            this.disableUptimeOption = false;
          }
        },
        (error) => {
          this.disableUptimeOption = false;
        }
      );
  }

  getScheduleUptimeTooltip() {
    // eslint-disable-next-line max-len
    const uptimeRequests = this.schedulesOnInstance.filter(
      (e) => e["uptime_instnace_id"] === this.instanceId
    );
    return uptimeRequests.length > 0
      ? ` Schedule Uptime is already requested on this instance from ${uptimeRequests[0]["uptime_schedule_from_date"]} to ${uptimeRequests[0]["uptime_schedule_to_date"]}`
      : "";
  }

  handleResizeFilterFormSubmit() {
    // console.log(this.data.stack) configuration
    this.callResolved = false;
    this.resizeFilterFormSubmitted = true;
    this.requestedInstanceType = undefined;
    this.selectedCpu = this.resize.cpu;
    this.selectedMemory = this.resize.memory;
    // eslint-disable-next-line max-len
    this.gatewayService
      .getDesiredInstanceTypesAndCosts(
        "get_desired_instance_types?cpu=" +
          this.selectedCpu +
          "&memory=" +
          this.selectedMemory +
          "&os=" +
          this.operatingSystem
      )
      .subscribe((response: any) => {
        console.log(response);
        this.pricing = response;
        this.transformPricing(this.pricing);
        this.callResolved = true;
        // this.snackBar.open('Your request has been sent successfully', 'close', {
        //     duration: 2000,
        // });
        // this.onNoClick();
        console.log("Access Request Sent Successfully");
      });
  }

  getTabHeading() {
    if (
      this.resizeWorkSpaceOnly &&
      !this.resizeAddDiskOnly &&
      !this.scheduleUpTime
    ) {
      if (this.selectedIndex === 0) {
        return `Manage Workstation`;
      } else if (this.selectedIndex === 1) {
        return "Resize Workstation";
      } else if (this.selectedIndex === 2) {
        return "Select schedule";
      } else {
        return "Resize Workstation";
      }
    }
    if (
      !this.resizeWorkSpaceOnly &&
      this.resizeAddDiskOnly &&
      !this.scheduleUpTime
    ) {
      if (this.selectedIndex === 0) {
        return `Manage Workstation`;
      } else if (this.selectedIndex === 1) {
        return "Additional Diskspace";
      } else if (this.selectedIndex === 2) {
        return "Select schedule";
      } else {
        return "Resize Workstation";
      }
    }
    if (
      !this.resizeWorkSpaceOnly &&
      !this.resizeAddDiskOnly &&
      this.scheduleUpTime
    ) {
      if (this.selectedIndex === 0) {
        return `Manage Workstation`;
      } else if (this.selectedIndex === 1) {
        return "Uptime schedule";
      } else {
        return "Resize Workstation";
      }
    }
    if (
      this.resizeWorkSpaceOnly &&
      this.resizeAddDiskOnly &&
      !this.scheduleUpTime
    ) {
      if (this.selectedIndex === 0) {
        return `Manage Workstation`;
      } else if (this.selectedIndex === 1) {
        return "Resize Workstation";
      } else if (this.selectedIndex === 2) {
        return "Additional Diskspace";
      } else if (this.selectedIndex === 3) {
        return "Select schedule";
      } else {
        return "Resize Workstation";
      }
    }
    if (
      this.resizeWorkSpaceOnly &&
      !this.resizeAddDiskOnly &&
      this.scheduleUpTime
    ) {
      if (this.selectedIndex === 0) {
        return `Manage Workstation`;
      } else if (this.selectedIndex === 1) {
        return "Resize Workstation";
      } else if (this.selectedIndex === 2) {
        return "Uptime schedule";
      } else if (this.selectedIndex === 3) {
        return "Select schedule";
      } else {
        return "Resize Workstation";
      }
    }
    if (
      !this.resizeWorkSpaceOnly &&
      this.resizeAddDiskOnly &&
      this.scheduleUpTime
    ) {
      if (this.selectedIndex === 0) {
        return `Manage Workstation`;
      } else if (this.selectedIndex === 1) {
        return "Uptime schedule";
      } else if (this.selectedIndex === 2) {
        return "Additional Diskspace";
      } else if (this.selectedIndex === 3) {
        return "Select schedule";
      } else {
        return "Resize Workstation";
      }
    }
    if (
      this.resizeWorkSpaceOnly &&
      this.resizeAddDiskOnly &&
      this.scheduleUpTime
    ) {
      if (this.selectedIndex === 0) {
        return `Manage Workstation`;
      } else if (this.selectedIndex === 1) {
        return "Resize Workstation";
      } else if (this.selectedIndex === 3) {
        return "Additional Diskspace";
      } else if (this.selectedIndex === 2) {
        return "Uptime schedule";
      } else if (this.selectedIndex === 4) {
        return "Select schedule";
      } else {
        return "Resize Workstation";
      }
    }
    if (this.selectedIndex === 0) {
      return `Manage Workstation`;
    } else if (this.selectedIndex === 1) {
      return "Resize Workstation";
    } else if (this.selectedIndex === 2) {
      return "Additional Diskspace";
    } else if (this.selectedIndex === 3) {
      return "Select schedule";
    } else {
      return "Resize Workstation";
    }
  }

  chkTrustedStatus(event) {
    console.log("event.value:" + event.value);
    console.log("trustedStatusBeforeCheck:" + this.trustedStatus);
    console.log(this.userTrustedStatus);
    this.selectedDataSet = this.messageModel.datasettype;
    this.selectedDataProvider = this.messageModel.dataProviderName;
    this.selectedDatatype = this.messageModel.subDataSet;
    console.log("SelectedDataType:" + this.selectedDatatype);
    const key =
      this.selectedDataSet +
      "-" +
      this.selectedDataProvider +
      "-" +
      this.selectedDatatype;
    console.log("key:" + key);
    this.trustedStatus = key in this.userTrustedStatus;
    console.log("this.userTrustedStatus:" + this.userTrustedStatus);
    console.log("trustedStatusAfterCheck:" + this.trustedStatus);
    const msg: string =
      "Oops. You already have 'Trusted User Status' for this dataset. \nPlease select another dataset or cancel this request.";
    if (this.trustedStatus === true) {
      this.snackBar.open(msg, "close", {
        duration: 10000,
        panelClass: "existing-trust-snackbar",
      });
    }
    return this.trustedStatus;
  }

  onTrustedStatusRequest() {
    this.trustedRequest = "Yes";
    this.acceptableUse = "Accept";
    this.submitRequest();
  }

  onPublishTableRequest($event: MouseEvent) {
    ($event.target as HTMLButtonElement).disabled = true;
    this.edgeTableRequestButtonLabel = "SUBMITTING...";
    this.exportRequestType = "Table";
    this.acceptableUse = "Accept";
    this.submitRequest();
  }

  submitRequest() {
    // alert(this.trustedAcceptableUse);
    this.selectedDataSet = this.messageModel.datasettype;
    this.selectedDataProvider = this.messageModel.dataProviderName;
    this.selectedDatatype = this.messageModel.subDataSet;
    this.derivedDataSetName = this.messageModel.derivedDatasetname;
    this.detailedDerivedDataset = this.messageModel.detailedderiveddataset;
    this.dataType = this.messageModel.datatype;
    this.dataSources = this.messageModel.datasources;
    // this.tags = this.messageModel.tags;
    this.justifyExport = this.messageModel.justifyExport;
    this.autoderiveddataset = this.messageModel.autoderiveddataset;
    this.autoreason = this.messageModel.autoreason;
    this.trustedUserJustification = this.messageModel.trustedUserJustification;
    this.edgePrivateDatabase = this.messageModel.edgePrivateDatabase;
    this.edgePrivateTable = this.messageModel.edgePrivateTable;

    console.log("this.userBucketName:" + this.userBucketName);
    console.log("this.selectedDataSet:" + this.selectedDataSet);
    console.log("this.derivedDataSetName:" + this.derivedDataSetName);
    console.log("this.autoreason:" + this.autoreason);
    console.log(
      "this.trustedUserJustification:" + this.trustedUserJustification
    );
    console.log("this.trustedRequest:" + this.trustedRequest);
    console.log("this.privateDatabase:" + this.edgePrivateDatabase);
    console.log("this.privateTable:" + this.edgePrivateTable);
    console.log("this.exportRequestType:" + this.exportRequestType);

    const approvalForm = {};

    if (this.exportRequestType === "Table" && this.edgePrivateDatabase) {
      approvalForm["privateDatabase"] = this.edgePrivateDatabase;
    }
    if (this.exportRequestType === "Table" && this.edgePrivateTable) {
      approvalForm["privateTable"] = this.edgePrivateTable;
    }
    if (this.selectedDataSet) {
      approvalForm["datasetName"] = this.selectedDataSet;
    }
    if (this.derivedDataSetName) {
      approvalForm["derivedDataSetname"] = this.derivedDataSetName;
    }
    if (this.detailedDerivedDataset) {
      approvalForm["detailedderiveddataset"] = this.detailedDerivedDataset;
    }
    if (this.selectedDataProvider) {
      approvalForm["dataprovider"] = this.selectedDataProvider;
    }
    if (this.selectedDatatype) {
      approvalForm["datatype"] = this.selectedDatatype;
    }
    if (this.dataSources) {
      approvalForm["datasources"] = this.dataSources;
    }
    // if (this.tags) {
    //     approvalForm['tags'] = this.tags;
    // }
    if (this.justifyExport) {
      approvalForm["justifyExport"] = this.justifyExport;
    }

    // Submit API gateway request
    const reqBody = {};
    // reqBody['S3KeyHash'] = this.messageModel.fileFolderName;//Md5.hashStr('');//add s3 key inside
    reqBody["RequestedBy_Epoch"] = new Date().getTime();
    // reqBody['DataSet_DataProvider_Datatype'] = this.selectedDataSet + "-" + this.selectedDataProvider + "-" + this.selectedDatatype;
    reqBody["ReqReceivedtimestamp"] = null;
    reqBody["RequestedBy"] = null;
    reqBody["WorkflowStatus"] = null;
    reqBody["RequestReviewStatus"] = "Submitted";
    reqBody["RequestReviewedBy"] = null;
    reqBody["ReqReviewTimestamp"] = null;
    reqBody["S3Key"] = this.messageModel.fileFolderName;
    reqBody["TeamBucket"] = this.userBucketName;
    reqBody["RequestID"] = null;
    reqBody["ApprovalForm"] = approvalForm;
    reqBody["UserID"] = this.userName;
    reqBody["selectedDataInfo"] = {
      selectedDataSet: this.selectedDataSet,
      selectedDataProvider: this.selectedDataProvider,
      selectedDatatype: this.selectedDatatype,
    };
    reqBody["acceptableUse"] = this.acceptableUse;
    reqBody["DatabaseName"] = this.edgePrivateDatabase;
    reqBody["TableName"] = this.edgePrivateTable;
    /*if(this.trustedRequest === "Yes" && (this.acceptableUse === "No" || this.acceptableUse == "")) {
            //alert("Usage policy to continue"); // Ribbon...
            this.snackBar.open('Acceptable use policy should be accepted to request trusted status', 'close', {
                duration: 2000,
            });
        } else { */

    if (this.exportRequestType === "Table") {
      this.gatewayService
        .sendExportRequest(
          "exportTable?message=" + encodeURIComponent(JSON.stringify(reqBody))
        )
        .subscribe((response: any) => {
          this.snackBar.open(
            "Your request has been sent successfully",
            "close",
            {
              duration: 2000,
            }
          );
          this.onNoClick();
          console.log("Request Sent Successfully");
        });
    } else {
      if (this.trustedRequest === "Yes") {
        // Submit API gateway request
        reqBody["trustedRequest"] = {
          trustedRequestStatus: "Submitted",
          trustedRequestReason: this.trustedUserJustification,
        };
      }

      // ***If the acceptable policy is Decline and the user has asked for trusted status: we should ignore the entry and not even store in dynamodb
      if (this.trustedRequest === "Yes" && this.acceptableUse === "Decline") {
        console.log("Declined acceptable usage policy");
        reqBody["trustedRequest"] = {
          trustedRequestStatus: "Untrusted",
          trustedRequestReason: this.trustedUserJustification,
        };
        reqBody["RequestReviewStatus"] = "Rejected";
      }

      if (this.trustedRequest === "No" && this.acceptableUse === "Decline") {
        console.log("Declined acceptable usage policy");
        reqBody["RequestReviewStatus"] = "Rejected";
      }

      if (this.autoExportRequest === "Yes") {
        reqBody["autoExportRequest"] = {
          autoExportRequestStatus: "Submitted",
          autoExportRequestDataset: this.autoderiveddataset,
          autoExportRequestReason: this.autoreason,
        };
      }

      this.gatewayService
        .sendExportRequest(
          "export?message=" + encodeURIComponent(JSON.stringify(reqBody))
        )
        .subscribe((response: any) => {
          this.snackBar.open(
            "Your request has been sent successfully",
            "close",
            {
              duration: 2000,
            }
          );
          this.onNoClick();
          console.log("Request Sent Successfully");
        });
    }
  }

  //TODO verify whether this is still called
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
    if (selectedVal === "Yes") {
      this.trustedRequest = "Yes";
    }
  }

  onAutoExportRequestGrpChange(selectedVal: any) {
    if (selectedVal === "Yes") {
      this.autoExportRequest = "Yes";
      this.autoExportRequestSelected = true;
    } else if (selectedVal === "No") {
      this.autoExportRequest = "No";
      this.autoExportRequestSelected = false;
    }
  }

  onOkayUploadClick(): void {
    this.uploadNotice = true;
  }

  uploadFiles(event1, location: string) {
    const totalFilesCount = event1.files.length;
    console.log("location = " + location);
    for (const file of event1.files) {
      console.log("Bucket name is = " + location);
      console.log("File name is = " + file.name);
      console.log("File type is = " + file.type);
      this.gatewayService
        .getPresignedUrl(
          "presigned_url?file_name=" +
            file.name +
            "&file_type=" +
            file.type +
            "&bucket_name=" +
            location +
            "&username=" +
            this.userName
        )
        .subscribe((response: any) => {
          const req = new HttpRequest("PUT", response, file, {
            reportProgress: true,
            headers: new HttpHeaders().set("Content-Type", file.type),
          });
          console.log("req == ", req);
          console.log("HAS PRESIGNED URL");
          this.http.request(req).subscribe((event) => {
            console.log("in http.request");
            // Via this API, you get access to the raw event stream.
            // Look for upload progress events.
            if (event.type === HttpEventType.UploadProgress) {
              // This is an upload progress event. Compute and show the % done:
              const percentDone = Math.round(
                (100 * event.loaded) / event.total
              );
              this.fileUpload.progress = percentDone;
              console.log("File is ${percentDone}% uploaded.", percentDone);
            } else if (event instanceof HttpResponse) {
              console.log("in if");
              //this.selectedFiles.push(file);
              event1.files.forEach((file1, index) => {
                console.log("File1 = ", file1, " index = ", index);
                if (file1.name === file.name) {
                  console.log("in ===");
                  this.fileUpload.remove(event1.files, index);
                }
              });
              console.log("Past for");
              this.uploadedFilesCount++;
              console.log("File is completely uploaded!");
              if (this.uploadedFilesCount === totalFilesCount) {
                this.snackBar.open(
                  "Your file(s) has been uploaded successfully",
                  "close",
                  {
                    duration: 2000,
                  }
                );
                this.uploadNotice = false;
                this.onNoClick();
              }
            }
          });
        });
    }
  }
}
