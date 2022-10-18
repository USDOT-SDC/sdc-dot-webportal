import { Component, OnInit } from '@angular/core';
import { ApiGatewayService } from '../../../services/apigateway.service';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections'
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { DataSource } from '@angular/cdk/table';
import { TableModule } from 'primeng/table';
import * as $ from 'jquery';

@Component({
    selector: 'app-exportrequests',
    templateUrl: './exportrequests.component.html',
    styleUrls: ['./exportrequests.component.css']
})
export class ExportRequestsComponent implements OnInit {
    constructor(private gatewayService: ApiGatewayService,
        public snackBar: MatSnackBar,
        public dialog: MatDialog) { }
     
    exportFileRequests = [];
    trustedRequests = [];
    autoExportRequests = [];
    metadata = {};
    user: any;
    cols: any = [];
    colsTrusted: any = [];
    colsAutoExport: any = [];
    userEmail: string;
    userName: string;
    detailsOnclick: any;
    userBucketName: string;

    ngOnInit() {
        this.userEmail = sessionStorage.getItem('email');
        console.log(this.userEmail);
        this.userName = sessionStorage.getItem('username');
        console.log(this.userName);

        this.getExportFileRequests();
        
        this.cols = [
          { field: 'Date', header: 'Date' },
          { field: 'userFullName', header: 'User' },
          { field: 'description', header: 'Description' },
          { field: 'team', header: 'Team' },
          { field: 'dataset', header: 'Dataset' },
          { field: 'reviewFile', header: 'Review File' },
          { field: 'approval', header: 'Approval' },
          { field: 'details', header: 'Details' },
          { field: 'exportFileForReview', header: 'Export File for Review'}
        ];

        this.colsTrusted = [
            { field: 'userFullName', header: 'User' },
            { field: 'dataset', header: 'Dataset' },
            { field: 'justification', header: 'Justification' },
            { field: 'approval', header: 'Approval' }
          ]

        this.colsAutoExport = [
            { field: 'userFullName', header: 'User' },
            { field: 'dataset', header: 'Dataset' },
            { field: 'justification', header: 'Justification' },
            { field: 'approval', header: 'Approval' }
        ]
    }

    getExportFileRequests() {
        this.exportFileRequests = [];
        this.trustedRequests = [];
        this.autoExportRequests = [];
        //this.exportFileRequests.push({'userFullName' : 'Srinivas Nannapaneni', 'description' : 'This is derived Dataset', 'team' : 'team1 bucket', 'dataset' : 'Waze-Waze-alert', 'details' : 'Details'  ,'reviewFile' : 'reviewFileOrLink'});
        //this.trustedRequests.push({'userFullName' : 'Srinivas Nannapaneni', 'dataset' : 'Waze-Waze-alert' });


        /*this.gatewayService.post("export/requests?message=" + encodeURI(JSON.stringify({}))).subscribe(
            (response: any) => {
                this.snackBar.open("Your request has been sent successfully", 'close', {
                    duration: 2000,
                });
                console.log('Request Sent Successfully');
            }
        );*/
        let reqBody = {};
        reqBody['userEmail'] = this.userEmail;

        this.gatewayService.post("export/requests?message=" + encodeURIComponent(JSON.stringify(reqBody))).subscribe(
            (response: any) => {
                for(let items of response['exportRequests']) {
                    for(let item of items) {
                        let justifyExport = "";
                        if('justifyExport' in item['ApprovalForm']) {
                            justifyExport = item['ApprovalForm']['justifyExport'];
                             }
                        this.exportFileRequests.push({
                            'userFullName' : item['RequestedBy'], 
                            'description' : justifyExport, 
                            'team' : item['TeamBucket'], 
                            'dataset' : item['Dataset-DataProvider-Datatype'], 
                            'details' : item['ApprovalForm'],
                            'reviewFile' : item['S3Key'],
                            'S3KeyHash' : item['S3KeyHash'],
                            'RequestedBy_Epoch':item['RequestedBy_Epoch'],
                            'S3Key' : item['S3Key'],
                            'TeamBucket' : item['TeamBucket'],
                            'RequestReviewStatus': item['RequestReviewStatus'],
                            'ReqReceivedTimestamp' : item['ReqReceivedTimestamp'],
                            'UserEmail': item['UserEmail'],
                            'TeamName': item['TeamName'],                               // NOT AN ATTRIBUTE  IN  exportFileRequestTable
                            'ReqReceivedDate': item['ReqReceivedDate']
                            }
                        );
                    } 
                }  
                       
                for(let items of response['trustedRequests']) {
                    for(let item of items) {
                         console.log(item);
                         this.trustedRequests.push({'userFullName' : item['UserID'],
                                                    'dataset' : item['Dataset-DataProvider-Datatype'],
                                                    'TrustedStatus' : item['TrustedStatus'],
                                                    'ReqReceivedTimestamp': item['ReqReceivedTimestamp'],
                                                    'UserEmail': item['UserEmail'],
                                                    'justification':item['TrustedJustification'] });
                    } 
                }

                for(let items of response['autoExportRequests']) {
                    for(let item of items) {
                        //console.log(item);
                        this.autoExportRequests.push({'userFullName' : item['UserID'],
                            'dataset' : item['Dataset-DataProvider-Datatype'],
                            'AutoExportStatus' : item['AutoExportStatus'],
                            'ReqReceivedTimestamp': item['ReqReceivedTimestamp'],
                            'UserEmail': item['UserEmail'],
                            'justification': item['Justification']});
                    }
                }

                console.log('Request Sent Successfully');
                this.exportFileRequests.sort(function(reqReceivedTimestamp1, reqReceivedTimestamp2){
                    return reqReceivedTimestamp1.ReqReceivedTimestamp < reqReceivedTimestamp2.ReqReceivedTimestamp ?1:-1;
                });
                this.trustedRequests.sort(function(reqReceivedTimestamp1, reqReceivedTimestamp2){
                    return reqReceivedTimestamp1.ReqReceivedTimestamp < reqReceivedTimestamp2.ReqReceivedTimestamp ?1:-1;
                });
                this.autoExportRequests.sort(function(reqReceivedTimestamp1, reqReceivedTimestamp2){
                    return reqReceivedTimestamp1.ReqReceivedTimestamp < reqReceivedTimestamp2.ReqReceivedTimestamp ?1:-1;
                });
            }
        );

        /*this.gatewayService.get('user_data?userBucketName=' + this.userBucketName).subscribe(
            (response: any) => {
            for(let x of response) {
                this.getMetadataForS3Objects(x).subscribe(
                    metadata => {
                        if (metadata != null){
                            this.myDatasets.push({'filename':x, 'download': metadata["download"], 'export': metadata["export"], 'publish': metadata["publish"]});
                        } else{
                            this.myDatasets.push({'filename':x, 'download': null, 'export': null, 'publish': null});
                        }
                    }
                );
             }
             console.log(this.myDatasets);
            }
        );*/
    }
    
    renderApprovalForm(approvalForm) {
        console.log(approvalForm.details);
        this.detailsOnclick = 1;
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '700px',
            height: '640px',
            data: { mailType: 'Details for export request', approvalForm: approvalForm.details}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    /*copyFileToTeamBucket(exportFileForReview) {
        var team_bucket = exportFileForReview.TeamBucket;            //teambucket from exportFileRequests array    
        var s3Key = exportFileForReview.S3Key;        
        let export_details = {};
        this.userBucketName = sessionStorage.getItem('team_bucket_name');
        export_details["provider_team_bucket"] = this.userBucketName;
        export_details["team_bucket"] = team_bucket;
        export_details["s3Key"] = s3Key;
        export_details["userName"] = this.userName;
        export_details["teamName"] = exportFileForReview.TeamName;              //teamName from exportFileRequests Array -- does not exist!!        
        this.gatewayService.post("export/requests/exportFileforReview?message=" + encodeURI(JSON.stringify(export_details))).subscribe(
            (response: any) => {
                // this.snackBar.open("File is exported for the data provider for review under the export_reviews folder for the team "+ export_details["teamName"], 'close', {
                 this.snackBar.open("File is exported for the data provider for review under the export_reviews folder", 'close', {                                  
                    duration: 12000,
                });
            }
        );
    }
     */

    requestDownload2(exportFileRequest) {
        console.log('requestDownload called');
        this.gatewayService.getDownloadUrl('download_url?bucket_name=' + exportFileRequest.team + '&file_name=' + exportFileRequest.reviewFile + '&username=' + exportFileRequest.userFullName).subscribe(
            (response: any) => {
            window.open(response);
        });
        console.log('requestDownload  ends')
    }

/*
    requestDownload(exportFileRequest) {
        this.gatewayService.getDownloadUrl('download_url?bucket_name=' + exportFileRequest.team + '&file_name=' + exportFileRequest.reviewFile).subscribe(
            (response: any) => {
            window.open(response);
        });
    }
*/

    submitApproval(status,targetObj) {
        let reqBody = {};
        reqBody['status'] = status;
        reqBody['key1'] = targetObj['S3KeyHash'];
        reqBody['key2'] = targetObj['RequestedBy_Epoch'];
        reqBody['datainfo'] = targetObj['dataset'];
        reqBody['S3Key'] = targetObj['S3Key'];
        reqBody['TeamBucket'] = targetObj['TeamBucket'];
        reqBody['userEmail'] = targetObj['UserEmail'];

        this.gatewayService.post("export/requests/updatefilestatus?message=" + encodeURI(JSON.stringify(reqBody))).subscribe(
            (response: any) => {
                this.getExportFileRequests();
                console.log('Request Sent Successfully');
            }
        );
    }
    
    submitTrustedApproval(status,key1,key2,trustedRequest) {
        let reqBody = {};
        reqBody['status'] = status;
        reqBody['key1'] = key1;
        reqBody['key2'] = key2;
        reqBody['userEmail'] = trustedRequest['UserEmail'];

        this.gatewayService.post("export/requests/updatetrustedtatus?message=" + encodeURI(JSON.stringify(reqBody))).subscribe(
            (response: any) => {
                this.getExportFileRequests();
                console.log('Request Sent Successfully');
            }
        );
    }

    submitAutoExportApproval(status,key1,key2,autoExportRequest) {
        let reqBody = {};
        reqBody['status'] = status;
        reqBody['key1'] = key1;
        reqBody['key2'] = key2;
        reqBody['userEmail'] = autoExportRequest['UserEmail'];

        this.gatewayService.post("export/requests/updateautoexportstatus?message=" + encodeURI(JSON.stringify(reqBody))).subscribe(
            (response: any) => {
                this.getExportFileRequests();
                console.log('Request Sent Successfully');
            }
        );
    }
     
    /* Cheryl - commenting out, this method is not being used anywhere
    getMetadataForS3Objects(filename: string): any {
        var resp;
        return this.gatewayService.getMetadataOfS3Object('get_metadata_s3?bucket_name=' + this.userBucketName + '&file_name=' + filename).map(
            (response: any) => {
                resp=response;
                return resp;
        });    
    }
    */

    parseQueryString(queryString: string): Map<string, string> {
        var params = new Map<string, string>();
        queryString = queryString.split("?")[1];
        var queries = queryString.split("&");

        queries.forEach((indexQuery: string) => {
            var indexPair = indexQuery.split("=");

            var queryKey = decodeURIComponent(indexPair[0]);
            var queryValue = decodeURIComponent(indexPair.length > 1 ? indexPair[1] : "");
            params[queryKey] = queryValue;
        });
        return params;
    }

}
