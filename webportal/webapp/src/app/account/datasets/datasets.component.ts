import { map } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { ApiGatewayService } from "../../../services/apigateway.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { DialogBoxComponent } from "../dialog-box/dialog-box.component";
import * as $ from "jquery";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Injectable, Inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule, MatHint } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DropdownModule } from "primeng/dropdown";
import * as AWS from "aws-sdk";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTooltipModule } from "@angular/material/tooltip";

import { MatIconModule } from "@angular/material/icon";
import {
  MatCommonModule,
  MatLineModule,
  MatNativeDateModule,
} from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatSortModule } from "@angular/material/sort";

import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { DialogModule } from "primeng/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { CdkTableModule } from "@angular/cdk/table";
import { FileUploadModule } from "primeng/fileupload";
import { MarkdownModule, MarkdownService } from "ngx-markdown";
//import { NoopAnimationsModule } from "@angular/platform-browser/animations";
//import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@Component({
  standalone: true,
  imports: [
    MatCardModule,
    MatExpansionModule,
    CommonModule,
    TableModule,
    DropdownModule,
    RouterModule,
    //BrowserAnimationsModule,
    MatDialogModule,
    DialogModule,

    // MatCardModule,
    // MatExpansionModule,

    ButtonModule,
    InputTextModule,
    FormsModule,
    MarkdownModule,
    RouterModule,
    // MatButtonModule,
    // MatCheckboxModule,
    // MatMenuModule,
    // MatTooltipModule,
    // MatToolbarModule,
    // MatIconModule,
    // MatRadioModule,
    // MatTabsModule,
    // MatProgressSpinnerModule,
    // MatDialogModule,
    // MatInputModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    CdkTableModule,
    FileUploadModule,
    // MatFormFieldModule,
    // MatSelectModule,
    // MatTableModule,
    // MatSnackBarModule,
    // //BrowserAnimationsModule,
    // MatDialogModule,
    //NoopAnimationsModule,
  ],
  selector: "app-datasets",
  templateUrl: "./datasets.component.html",
  styleUrls: ["./datasets.component.css"],
  //animations: ["@bodyExpansion.done"],
  providers: [
    // CognitoService,
    // ApiGatewayService,
    //MatSnackBar,
    // MatDialogModule,
    MatDialog,
    // LoginSyncService,
    // LoginSyncGuard,
    // LoaderService,
    // LoaderInterceptor,
    // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    // { provide: WindowToken, useFactory: windowProvider }
  ],
})
export class DatasetsComponent implements OnInit {
  constructor(
    private gatewayService: ApiGatewayService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}
  sdcElements: any = [];
  sortedSdcElements: any = [];
  sdcDatasets: any = [];
  sdcAlgorithms: any = [];
  myDatasets = [];
  metadata = {};
  selectedItems: any[] = [];
  items: any[] = [
    { label: "Datalake", value: "Datalake" },
    { label: "Team Bucket", value: "Team Bucket" },
  ];
  showDialog: boolean = false;
  user: any;
  selectedsdcDataset: any = {};
  showChecklist: boolean = false;
  dictionary: string;
  showDictionary: boolean = false;
  userBucketName: any = "";
  upload_locations: any = "";
  stacks: any = [];
  response: any = "";
  cols: any = [];
  selectedFiles: any = [];
  userTrustedStatus: any;
  userName: any;
  userEmail: any;
  requestReviewStatus: any;
  componentName: any;

  ngOnInit() {
    this.componentName = "Datasets";
    this.getUserInfo();
    var sdcDatasetsString = sessionStorage.getItem("datasets");
    this.sdcElements = JSON.parse(sdcDatasetsString);
    var stacksString = sessionStorage.getItem("stacks");
    this.userBucketName = sessionStorage.getItem("team_bucket_name");
    this.response = sessionStorage.getItem("response");
    this.upload_locations = sessionStorage.getItem("upload_locations");
    this.userName = sessionStorage.getItem("username");
    this.sortedSdcElements = this.sdcElements.reverse();
    this.sortedSdcElements.forEach((element) => {
      if (element.Type == "Algorithm") {
        if (element.Owner == "SDC platform")
          this.sdcAlgorithms.unshift(element);
        else this.sdcAlgorithms.push(element);
      } else {
        if (element.Owner == "SDC platform") this.sdcDatasets.unshift(element);
        else this.sdcDatasets.push(element);
      }
    });
    this.getMyDatasetsList();

    this.cols = [
      { field: "filename", header: "Filename" },
      { field: "export", header: "Export" },
      { field: "publish", header: "Publish" },
      { field: "exportRequestStatus", header: "Export Request Status" },
    ];
    let trustedStatus = sessionStorage.getItem("userTrustedStatus");
    console.log("Trusted status" + trustedStatus);
    this.userTrustedStatus = JSON.parse(trustedStatus);
    console.log("Trusted status" + JSON.stringify(this.userTrustedStatus));
  }

  getUserInfo() {
    this.gatewayService.getUserInfo("user").subscribe((response: any) => {
      sessionStorage.setItem("response", response);
      sessionStorage.setItem("username", response.username);
      sessionStorage.setItem(
        "upload_locations",
        JSON.stringify(response.upload_locations)
      );
      sessionStorage.setItem("email", response.email);
      sessionStorage.setItem("teamSlug", response.team_slug); // team_slug from user stacks table is used as both Team Name and Edge database name
      sessionStorage.setItem("stacks", JSON.stringify(response.stacks));
      sessionStorage.setItem("datasets", JSON.stringify(response.datasets));
      sessionStorage.setItem("roles", response.role);
      sessionStorage.setItem(
        "userTrustedStatus",
        JSON.stringify(response.userTrustedStatus)
      );
      console.log("User info:" + response.userTrustedStatus);
      // Extract and exportWorkflow all exportWorkflow from datasets
      let combinedEW = {};
      for (let dset in response.datasets) {
        let key = "exportWorkflow";
        let dtEWExists = key in response.datasets[dset];
        if (dtEWExists) {
          $.extend(combinedEW, response.datasets[dset]["exportWorkflow"]);
        }
      }
      sessionStorage.setItem("exportWorkflow", JSON.stringify(combinedEW));
      for (var i = 0; i < response.stacks.length; i++) {
        if (response.stacks[i].instance_id) {
          sessionStorage.setItem("instance-id", response.stacks[i].instance_id);
          sessionStorage.setItem(
            "team_bucket_name",
            response.stacks[i].team_bucket_name
          );
        }
      }
    });
  }

  getMyDatasetsList() {
    console.log(
      "getMyDatasetsList called: get URL = " +
        this.userBucketName +
        "&username=" +
        this.userName
    );
    this.gatewayService
      .get(
        "user_data?userBucketName=" +
          this.userBucketName +
          "&username=" +
          this.userName
      )
      .subscribe((response: any) => {
        for (let x of response) {
          this.getMetadataForS3Objects(x).subscribe((metadata) => {
            if (metadata != null) {
              let trusted = false;
              // check if user is trusted for a dataset
              for (var dt in this.userTrustedStatus) {
                if (dt in metadata) {
                  this.myDatasets.push({
                    filename: x,
                    download: "true",
                    export: "false",
                    publish: "true",
                    requestReviewStatus: metadata["requestReviewStatus"],
                  });
                  trusted = true;
                }
              }
              if (!trusted) {
                this.myDatasets.push({
                  filename: x,
                  download: metadata["download"],
                  export: metadata["export"],
                  publish: metadata["publish"],
                  requestReviewStatus: metadata["requestReviewStatus"],
                });
              }
            } else {
              this.myDatasets.push({
                filename: x,
                download: null,
                export: null,
                publish: null,
              });
            }
          });
        }
        console.log("My Datasets: " + JSON.stringify(this.myDatasets));
        console.log("my Datasets length = " + this.myDatasets.length);
      });
  }

  getRequestReviewStatus(filename) {
    console.log("getRequestReviewStatus called, filename: " + filename);
    let reqBody = {};
    this.userEmail = sessionStorage.getItem("email");
    reqBody["userEmail"] = this.userEmail;
    reqBody["filename"] = filename;
    console.log(
      "getRequestReviewStatus - URI = " + encodeURI(JSON.stringify(reqBody))
    );
    this.gatewayService
      .get("exportrequeststatus?message=" + encodeURI(JSON.stringify(reqBody)))
      .subscribe((response: any) => {
        var resp = response["Items"][0];
      });
  }

  selectsdcDataset(dataset) {
    this.selectedsdcDataset = dataset;
    this.showDictionary = true;
    console.log(
      "select sdc dataset called - get URL: " +
        this.selectedsdcDataset.ReadmeBucket +
        "&readmepathkey=" +
        this.selectedsdcDataset.ReadmePathKey
    );
    this.gatewayService
      .get(
        "dataset_dictionary?readmebucket=" +
          this.selectedsdcDataset.ReadmeBucket +
          "&readmepathkey=" +
          this.selectedsdcDataset.ReadmePathKey
      )
      .subscribe(
        (response: any) => {
          this.dictionary = response.data;
        },
        (error: any) => {
          this.showDictionary = false;
          this.snackBar.open("Data Dictionary not available", "close", {
            duration: 2000,
          });
        }
      );
  }

  requestMail(BucketName, mailType, datasetName) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "500px",
      data: {
        bucketName: BucketName,
        mailType: mailType,
        datasetName: datasetName,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("requestMail");
      console.log("The dialog was closed");
    });
  }

  requestExport(BucketName, mailType, datasetName) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      panelClass: "custom-export-dialog",
      width: "65vw",
      height: "75vh",
      disableClose: true,
      data: {
        userBucketName: this.userBucketName,
        mailType: mailType,
        datasetName: datasetName,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      this.myDatasets = [];
      this.getMyDatasetsList();
    });
  }

  requestTableExport(/*BucketName,*/ mailType) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      panelClass: "custom-export-dialog",
      width: "65vw",
      height: "75vh",
      disableClose: true,
      data: { /*userBucketName: this.userBucketName,*/ mailType: mailType },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The Table Export request dialog was closed");
      //this.myDatasets = [];
      //this.getMyDatasetsList();
    });
  }

  requestTrustedStatus(/*BucketName,*/ mailType) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      panelClass: "custom-export-dialog",
      width: "65vw",
      height: "75vh",
      disableClose: true,
      data: { /*userBucketName: this.userBucketName,*/ mailType: mailType },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The Trusted Status request dialog was closed");
      //this.myDatasets = [];
      //this.getMyDatasetsList();
    });
  }

  uploadFilesToS3(requestType) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "500px",
      data: { userBucketName: this.userBucketName, requestType: requestType },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The upload files to s3 dialog was closed");
      this.myDatasets = [];
      this.getMyDatasetsList();
    });
  }

  requestDownload() {
    console.log("requestDownload called");
    for (let selectedFile of this.selectedFiles) {
      this.myDatasets.forEach((datasetObj, index) => {
        if (selectedFile.filename == datasetObj["filename"]) {
          if (datasetObj["download"] == "true") {
            this.gatewayService
              .getDownloadUrl(
                "download_url?bucket_name=" +
                  this.userBucketName +
                  "&file_name=" +
                  selectedFile.filename +
                  "&username=" +
                  this.userName
              )
              .subscribe((response: any) => {
                window.open(response, "_blank");
              });
          }
        } else {
          console.log("selected file datasetObj key is not filename");
        }
      });
    }
  }

  getMetadataForS3Objects(filename: string): any {
    var resp;
    console.log("getMetadataForS3Objects called");
    return this.gatewayService
      .getMetadataOfS3Object(
        "get_metadata_s3?bucket_name=" +
          this.userBucketName +
          "&file_name=" +
          filename
      )
      .pipe(
        map((response: any) => {
          resp = response;
          return resp;
        })
      );
  }

  parseQueryString(queryString: string): Map<string, string> {
    var params = new Map<string, string>();
    queryString = queryString.split("?")[1];
    var queries = queryString.split("&");

    queries.forEach((indexQuery: string) => {
      var indexPair = indexQuery.split("=");

      var queryKey = decodeURIComponent(indexPair[0]);
      var queryValue = decodeURIComponent(
        indexPair.length > 1 ? indexPair[1] : ""
      );

      params[queryKey] = queryValue;
    });

    return params;
  }

  displayDialog: boolean = false;
  showDatalakeDropdown: boolean = false;
  checklistItems: any[] = [
    { name: "Team Bucket", checked: false },
    { name: "Datalake", checked: false },
  ];

  datalakeOptions: any[] = [
    { name: "2022", checked: false },
    { name: "2023", checked: false },
  ];
  fileUploaded: boolean = false; // Add this variable
  sanitizer: DomSanitizer;

  showDialog1() {
    this.displayDialog = true;
  }

  onFileUpload(event: any) {
    // Handle file upload here
    console.log("Uploaded File:", event.files[0]);
    this.fileUploaded = true; // Set to true after file upload
  }
  evaluateHtml(item: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      item.replace("{{ userBucketName }}", this.userBucketName)
    );
  }

  goBack() {
    this.fileUploaded = false; // Set to false to go back to file upload section
  }

  saveCheckedItems() {
    const checkedItems = this.checklistItems.filter((item) => item.checked);
    const datalakeSelected = this.checklistItems.find(
      (item) => item.name === "Datalake"
    )?.checked;

    // Logic to save the checked items
    console.log("Checked items:", checkedItems);
    if (datalakeSelected) {
      const datalakeExtraOptions = this.datalakeOptions.filter(
        (option) => option.checked
      );
      console.log("Datalake Extra Options:", datalakeExtraOptions);
    }

    this.displayDialog = false;
  }

  closeDialog() {
    this.displayDialog = false;
    this.showDatalakeDropdown = false;
    this.datalakeOptions.forEach((option) => (option.checked = false));
  }

  onCheckboxChange(item: any) {
    if (item.name === "Datalake") {
      this.showDatalakeDropdown = item.checked;
    }
  }
}
