import { Component, OnInit } from "@angular/core";
import { ApiGatewayService } from "../../../services/apigateway.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AccordionModule } from "primeng/accordion";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";

//import { MatCard } from '@angular/material/card';
import { SelectionModel } from "@angular/cdk/collections";
import { DialogBoxComponent } from "../dialog-box/dialog-box.component";
import { CdkTableModule, DataSource } from "@angular/cdk/table";
import { TableModule } from "primeng/table";
import * as $ from "jquery";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
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
import { DialogModule } from "@angular/cdk/dialog";
import { MatIconModule } from "@angular/material/icon";

import {
  MatCommonModule,
  MatLineModule,
  MatNativeDateModule,
} from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatSortModule } from "@angular/material/sort";

import { InputTextModule } from "primeng/inputtext";

import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CheckboxModule } from "primeng/checkbox";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { FileUploadModule } from "primeng/fileupload";
import { TagModule } from "primeng/tag";

import { RequestReviewStatusSeverityPipe } from "./request-review-status.pipe";
import { PanelModule } from "primeng/panel";
import { ExportRequestsPanelComponent } from "./export-requests-panel.component";

@Component({
  standalone: true,
  imports: [
    MatCardModule,
    TagModule,
    MatExpansionModule,
    TableModule,
    CommonModule,
    RequestReviewStatusSeverityPipe,
    MatDialogModule,
    AccordionModule,
    FormsModule,
    CdkTableModule,
    CommonModule,
    DialogModule,
    InputTextModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    PanelModule,
    MatMenuModule,
    MatTooltipModule,
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
    CardModule,
    ButtonModule,
    FileUploadModule,

    ExportRequestsPanelComponent,
  ],
  selector: "app-exportrequests",
  templateUrl: "./exportrequests.component.html",
  styleUrls: ["./exportrequests.component.css"],
  providers: [
    // CognitoService,
    //ApiGatewayService,
    MatDialog,
    //MatSnackBar,
    //MatDialogModule,
    // LoginSyncService,
    // LoginSyncGuard,
    // LoaderService,
    // LoaderInterceptor,
    // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    // { provide: WindowToken, useFactory: windowProvider }
  ],
})
export class ExportRequestsComponent implements OnInit {
  constructor(
    private gatewayService: ApiGatewayService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  exportFileRequests = [];
  exportTableRequests = [];
  trustedRequests = [];
  autoExportRequests = [];
  metadata = {};
  user: any;
  cols: any = [];
  colsExportTable: any = [];
  colsTrusted: any = [];
  colsAutoExport: any = [];
  userEmail: string;
  userName: string;
  detailsOnclick: any;
  userBucketName: string;

  ngOnInit() {
    this.userEmail = sessionStorage.getItem("email"); //Reminder: this is data steward user information
    console.log(this.userEmail);
    this.userName = sessionStorage.getItem("username");
    console.log(this.userName);

    this.getExportFileRequests();

    this.cols = [
      { field: "ReqReceivedDate", header: "Date" },
      { field: "userFullName", header: "User" },
      { field: "description", header: "Description" },
      { field: "team", header: "Team" },
      { field: "dataset", header: "Dataset" },
      { field: "reviewFile", header: "File Name" },
      { field: "RequestReviewStatus", header: "Approval" },
      { field: "details", header: "Details" },
      { field: "exportFileForReview", header: "Download File for Review" },
    ];

    this.colsExportTable = [
      { field: "ReqReceivedDate", header: "Date" },
      { field: "userFullName", header: "User" },
      { field: "UserEmail", header: "Email" },
      { field: "justification", header: "Justification" },
      { field: "team", header: "Team" },
      { field: "dataset", header: "Dataset" },
      { field: "table", header: "Table" },
      { field: "RequestReviewStatus", header: "Approval" },
      { field: "details", header: "Details" }, //Q: Do we really need this if same info is loaded elsewhere in the table already? -- do we even actually create this???
    ];

    this.colsTrusted = [
      { field: "userFullName", header: "User" },
      { field: "dataset", header: "Dataset" },
      { field: "justification", header: "Justification" },
      { field: "TrustedStatus", header: "Approval" },
    ];

    this.colsAutoExport = [
      { field: "userFullName", header: "User" },
      { field: "dataset", header: "Dataset" },
      { field: "justification", header: "Justification" },
      { field: "AutoExportStatus", header: "Approval" },
    ];
  }

  getExportFileRequests() {
    this.exportFileRequests = [];
    this.exportTableRequests = [];
    this.trustedRequests = [];
    this.autoExportRequests = [];

    let reqBody = {};
    reqBody["userEmail"] = this.userEmail;

    this.gatewayService
      .post(
        "export/requests?message=" + encodeURIComponent(JSON.stringify(reqBody))
      )
      .subscribe((response: any) => {
        for (let item of response["exportRequests"]["s3Requests"]) {
          // for(let item of items) {
          let justifyExport = "";
          if ("justifyExport" in item["ApprovalForm"]) {
            justifyExport = item["ApprovalForm"]["justifyExport"];
          }
          this.exportFileRequests.push({
            userFullName: item["RequestedBy"],
            description: justifyExport,
            team: item["TeamBucket"],
            dataset: item["Dataset-DataProvider-Datatype"],
            details: item["ApprovalForm"],
            reviewFile: item["S3Key"],
            S3KeyHash: item["S3KeyHash"],
            RequestedBy_Epoch: item["RequestedBy_Epoch"],
            S3Key: item["S3Key"],
            TeamBucket: item["TeamBucket"],
            RequestReviewStatus: item["RequestReviewStatus"],
            ReqReceivedTimestamp: item["ReqReceivedTimestamp"],
            UserEmail: item["UserEmail"],
            TeamName: item["TeamName"], // NOT AN ATTRIBUTE  IN  exportFileRequestTable
            ReqReceivedDate: item["ReqReceivedDate"],
          });
          // }
        }

        for (let item of response["exportRequests"]["tableRequests"]) {
          //  for(let item of items) {
          let justifyExport = "";
          if ("justifyExport" in item["ApprovalForm"]) {
            justifyExport = item["ApprovalForm"]["justifyExport"];
          }
          let teamName = "";
          if ("privateDatabase" in item["ApprovalForm"]) {
            // privateDatabase assigned from team_slug
            teamName = item["ApprovalForm"]["privateDatabase"];
          }
          this.exportTableRequests.push({
            userFullName: item["RequestedBy"],
            justification: justifyExport,
            team: teamName,
            dataset: item["Dataset-DataProvider-Datatype"],
            table: item["TableName"],
            details: item["ApprovalForm"],
            // 'reviewFile' : item['S3Key'],
            S3KeyHash: item["S3KeyHash"],
            RequestedBy_Epoch: item["RequestedBy_Epoch"],
            S3Key: item["S3Key"],
            // 'TeamBucket' : item['TeamBucket'],
            RequestReviewStatus: item["RequestReviewStatus"],
            ReqReceivedTimestamp: item["ReqReceivedTimestamp"],
            UserEmail: item["UserEmail"],
            //'TeamName': item['TeamName'],
            ReqReceivedDate: item["ReqReceivedDate"],
          });
          //  }
        }

        for (let items of response["trustedRequests"]) {
          for (let item of items) {
            console.log(item);
            this.trustedRequests.push({
              userFullName: item["UserID"],
              dataset: item["Dataset-DataProvider-Datatype"],
              TrustedStatus: item["TrustedStatus"],
              ReqReceivedTimestamp: item["ReqReceivedTimestamp"],
              UserEmail: item["UserEmail"],
              justification: item["TrustedJustification"],
            });
          }
        }

        for (let items of response["autoExportRequests"]) {
          for (let item of items) {
            this.autoExportRequests.push({
              userFullName: item["UserID"],
              dataset: item["Dataset-DataProvider-Datatype"],
              AutoExportStatus: item["AutoExportStatus"],
              ReqReceivedTimestamp: item["ReqReceivedTimestamp"],
              UserEmail: item["UserEmail"],
              justification: item["Justification"],
            });
          }
        }

        console.log("Request Sent Successfully");

        this.exportFileRequests.sort(function (
          reqReceivedTimestamp1,
          reqReceivedTimestamp2
        ) {
          return reqReceivedTimestamp1.ReqReceivedTimestamp <
            reqReceivedTimestamp2.ReqReceivedTimestamp
            ? 1
            : -1;
        });
        this.exportTableRequests.sort(function (
          reqReceivedTimestamp1,
          reqReceivedTimestamp2
        ) {
          return reqReceivedTimestamp1.ReqReceivedTimestamp <
            reqReceivedTimestamp2.ReqReceivedTimestamp
            ? 1
            : -1;
        });
        this.trustedRequests.sort(function (
          reqReceivedTimestamp1,
          reqReceivedTimestamp2
        ) {
          return reqReceivedTimestamp1.ReqReceivedTimestamp <
            reqReceivedTimestamp2.ReqReceivedTimestamp
            ? 1
            : -1;
        });
        this.autoExportRequests.sort(function (
          reqReceivedTimestamp1,
          reqReceivedTimestamp2
        ) {
          return reqReceivedTimestamp1.ReqReceivedTimestamp <
            reqReceivedTimestamp2.ReqReceivedTimestamp
            ? 1
            : -1;
        });
      });
  }

  renderApprovalForm(approvalForm) {
    console.log(approvalForm.details);
    this.detailsOnclick = 1;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "700px",
      height: "640px",
      data: {
        mailType: "Details for export request",
        approvalForm: approvalForm.details,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  renderTableApprovalForm(approvalForm) {
    console.log(approvalForm.details);
    this.detailsOnclick = 1;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "700px",
      height: "640px",
      data: {
        mailType: "Details for Edge Table Publication Request",
        approvalForm: approvalForm.details,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  requestDownloadForReview(exportFileRequest) {
    console.log("requestDownloadForReview called");
    this.gatewayService
      .getDownloadUrl(
        "download_url?bucket_name=" +
          exportFileRequest.team +
          "&file_name=" +
          exportFileRequest.reviewFile +
          "&username=" +
          exportFileRequest.userFullName
      )
      .subscribe((response: any) => {
        window.open(response);
      });
    console.log("requestDownloadForReview  ends");
  }

  submitApproval(status, targetObj) {
    let reqBody = {};
    reqBody["status"] = status;
    reqBody["key1"] = targetObj["S3KeyHash"];
    reqBody["key2"] = targetObj["RequestedBy_Epoch"];
    reqBody["datainfo"] = targetObj["dataset"];
    reqBody["S3Key"] = targetObj["S3Key"];
    reqBody["TeamBucket"] = targetObj["TeamBucket"];
    reqBody["userEmail"] = targetObj["UserEmail"];
    console.log("==============================");
    console.log(reqBody["key1"]);
    console.log("==============================");
    this.gatewayService
      .post(
        "export/requests/updatefilestatus?message=" +
          encodeURI(JSON.stringify(reqBody))
      )
      .subscribe((response: any) => {
        this.getExportFileRequests();
        console.log("Request Sent Successfully");
      });
  }

  submitTableApproval(status, targetObj) {
    let reqBody = {};
    reqBody["status"] = status;
    reqBody["key1"] = targetObj["S3KeyHash"];
    reqBody["key2"] = targetObj["RequestedBy_Epoch"];
    reqBody["datainfo"] = targetObj["dataset"];
    reqBody["S3Key"] = targetObj["S3Key"];
    reqBody["TableName"] = targetObj["table"];
    reqBody["userEmail"] = targetObj["UserEmail"];

    this.gatewayService
      .post(
        "export/requests/updatefilestatus?message=" +
          encodeURI(JSON.stringify(reqBody))
      )
      .subscribe((response: any) => {
        this.getExportFileRequests();
        console.log("Request Sent Successfully");
      });
  }

  submitTrustedApproval(status, key1, key2, trustedRequest) {
    let reqBody = {};
    reqBody["status"] = status;
    reqBody["key1"] = key1;
    reqBody["key2"] = key2;
    reqBody["userEmail"] = trustedRequest["UserEmail"];

    this.gatewayService
      .post(
        "export/requests/updatetrustedtatus?message=" +
          encodeURI(JSON.stringify(reqBody))
      )
      .subscribe((response: any) => {
        this.getExportFileRequests();
        console.log("Request Sent Successfully");
      });
  }

  submitAutoExportApproval(status, key1, key2, autoExportRequest) {
    let reqBody = {};
    reqBody["status"] = status;
    reqBody["key1"] = key1;
    reqBody["key2"] = key2;
    reqBody["userEmail"] = autoExportRequest["UserEmail"];

    this.gatewayService
      .post(
        "export/requests/updateautoexportstatus?message=" +
          encodeURI(JSON.stringify(reqBody))
      )
      .subscribe((response: any) => {
        this.getExportFileRequests();
        console.log("Request Sent Successfully");
      });
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
}
