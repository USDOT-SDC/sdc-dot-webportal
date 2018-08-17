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
    metadata = {};
    user: any;
    cols: any = [];
    colsTrusted: any = [];
    userEmail: string;
    userName: string;

    ngOnInit() {
        this.userEmail = sessionStorage.getItem('email');
        this.userName = sessionStorage.getItem('username');

        this.getExportFileRequests();
        
        this.cols = [
          { field: 'userFullName', header: 'User Full Name' },
          { field: 'description', header: 'Description' },
          { field: 'team', header: 'Team' },
          { field: 'dataset', header: 'Dataset' },
          { field: 'reviewFile', header: 'Review File' },
          { field: 'trustedApproval', header: 'Trusted Approval' },
          { field: 'approval', header: 'Approval' },
          { field: 'details', header: 'Details' }
        ];

        this.colsTrusted = [
            { field: 'userFullName', header: 'User Full Name' },
            { field: 'dataset', header: 'Dataset' },
            { field: 'approval', header: 'Approval' }
            
          ]
    }

    getExportFileRequests() {
        this.exportFileRequests = [];
        this.trustedRequests = [];
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

        this.gatewayService.post("export/requests?message=" + encodeURI(JSON.stringify(reqBody))).subscribe(
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
                            'details' : 'Details',
                            'reviewFile' : item['S3Key'],
                            'S3KeyHash' : item['S3KeyHash'],
                            'RequestedBy_Epoch':item['RequestedBy_Epoch'],
                            'S3Key' : item['S3Key'],
                            'TeamBucket' : item['TeamBucket']
                           }
                        );
                        console.log(item);
                    } 
                }    
                for(let items of response['trustedRequests']) {
                    for(let item of items) {
                         //console.log(item);
                         this.trustedRequests.push({'userFullName' : item['UserID'], 
                                                    'dataset' : item['Dataset-DataProvider-Datatype']});
                    } 
                }  
                console.log('Request Sent Successfully');
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
    
    submitApproval(status,targetObj) {
           
            console.log(status);
            console.log(targetObj);
            console.log(targetObj.S3KeyHash);
            console.log(targetObj.RequestedBy_Epoch);

            let reqBody = {};
            reqBody['status'] = status;
            reqBody['key1'] = targetObj['S3KeyHash'];
            reqBody['key2'] = targetObj['RequestedBy_Epoch'];
            reqBody['datainfo'] = targetObj['dataset'];
            reqBody['S3Key'] = targetObj['S3Key'];
            reqBody['TeamBucket'] = targetObj['TeamBucket'];

            this.gatewayService.post("export/requests/updatefilestatus?message=" + encodeURI(JSON.stringify(reqBody))).subscribe(
                (response: any) => {
                    this.getExportFileRequests();
                    console.log('Request Sent Successfully');
                }
            );

    }
    submitTrustedApproval(status,key1,key2) {
        console.log(status);
        console.log(key1);
        console.log(key2);

        let reqBody = {};
        reqBody['status'] = status;
        reqBody['key1'] = key1;
        reqBody['key2'] = key2;

        this.gatewayService.post("export/requests/updatetrustedtatus?message=" + encodeURI(JSON.stringify(reqBody))).subscribe(
            (response: any) => {
                this.getExportFileRequests();
                console.log('Request Sent Successfully');
            }
        );

    }

     

    getMetadataForS3Objects(filename: string): any {
        var resp;
        /*return this.gatewayService.getMetadataOfS3Object('get_metadata_s3?bucket_name=' + this.userBucketName + '&file_name=' + filename).map(
            (response: any) => {
                resp=response;
                return resp;
        }); */   
    }

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
