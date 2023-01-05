
import {map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ApiGatewayService } from '../../../services/apigateway.service';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import * as $ from 'jquery';

@Component({
    selector: 'app-datasets',
    templateUrl: './datasets.component.html',
    styleUrls: ['./datasets.component.css']
})

export class DatasetsComponent implements OnInit {
    constructor(private gatewayService: ApiGatewayService,
        public snackBar: MatSnackBar,
        public dialog: MatDialog) { }
    sdcElements: any = [];
    sortedSdcElements: any = [];
    sdcDatasets: any = [];
    sdcAlgorithms: any = [];
    myDatasets = [];
    metadata = {};
    user: any;
    selectedsdcDataset: any = {};
    dictionary: string;
    showDictionary: boolean = false;
    userBucketName: any;
    stacks: any = [];
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
        var sdcDatasetsString = sessionStorage.getItem('datasets');
        this.sdcElements = JSON.parse(sdcDatasetsString);
        var stacksString = sessionStorage.getItem('stacks');
        this.userBucketName = sessionStorage.getItem('team_bucket_name');
        this.userName = sessionStorage.getItem('username');
        this.sortedSdcElements= this.sdcElements.reverse();
        this.sortedSdcElements.forEach(element => {
            if (element.Type == "Algorithm")
            {
                if ( element.Owner == "SDC platform" )
                    this.sdcAlgorithms.unshift(element);
                else
                    this.sdcAlgorithms.push(element);
            }
            else
            {
                if ( element.Owner == "SDC platform" )
                    this.sdcDatasets.unshift(element);
                else
                    this.sdcDatasets.push(element);
            }
        });
        this.getMyDatasetsList();
        console.log("My Datasets length = " + this.myDatasets.length);
        
        this.cols = [
          { field: 'filename', header: 'Filename' },
          { field: 'export', header: 'Export' },
          { field: 'publish', header: 'Publish' },
          { field: 'exportRequestStatus', header: 'Export Request Status'}
        ]
        let trustedStatus = sessionStorage.getItem('userTrustedStatus');
        console.log("Trusted status"+trustedStatus);
        this.userTrustedStatus = JSON.parse(trustedStatus);
        console.log("Trusted status"+ JSON.stringify(this.userTrustedStatus));
    }

    getUserInfo() {
        console.log("getUserInfo called");
        this.gatewayService.getUserInfo('user').subscribe(
            (response: any) => {
                sessionStorage.setItem('username', response.username);
                sessionStorage.setItem('email', response.email);
                sessionStorage.setItem('teamSlug', response.team_slug);                         // team_slug from user stacks table is used as both Team Name and Edge database name 
                sessionStorage.setItem('stacks', JSON.stringify(response.stacks));
                sessionStorage.setItem('datasets', JSON.stringify(response.datasets));
                sessionStorage.setItem('roles', response.role);
                sessionStorage.setItem('userTrustedStatus', JSON.stringify(response.userTrustedStatus));
                console.log("User info:"+response.userTrustedStatus);
                // Extract and exportWorkflow all exportWorkflow from datasets                                                   
                let combinedEW = {};
                for (let dset in response.datasets) {                  
                  let key = "exportWorkflow";
                  let dtEWExists =  key in response.datasets[dset];
                    if(dtEWExists) {
                      $.extend(combinedEW,response.datasets[dset]["exportWorkflow"]);
                    }
                }
                sessionStorage.setItem('exportWorkflow', JSON.stringify(combinedEW));
                for (var i = 0; i < response.stacks.length; i++) {
                  if (response.stacks[i].instance_id) {
                    sessionStorage.setItem('instance-id', response.stacks[i].instance_id);
                    sessionStorage.setItem('team_bucket_name', response.stacks[i].team_bucket_name);
                  }
                }
            }
        );
    }
 
    getMyDatasetsList() {
        console.log('getMyDatasetsList called: get URL = ' + this.userBucketName + '&username=' + this.userName);
        this.gatewayService.get('user_data?userBucketName=' + this.userBucketName + '&username=' + this.userName).subscribe(
            (response: any) => {
            for(let x of response) {
                this.getMetadataForS3Objects(x).subscribe(
                    metadata => {
                        if (metadata != null) {
                               let  trusted = false;
                                // check if user is trusted for a dataset
                                for( var dt in this.userTrustedStatus) {
                                    //console.log(dt);
                                    //console.log()
                                    if(dt in metadata) {
                                        this.myDatasets.push({'filename':x, 'download': 'true', 'export': 'false', 'publish': 'true', 'requestReviewStatus': metadata["requestReviewStatus"]});
                                        trusted = true;
                                    }
                                }
                                if(!trusted) {
                                    this.myDatasets.push({'filename':x, 'download': metadata["download"], 'export': metadata["export"], 'publish': metadata["publish"], 'requestReviewStatus': metadata["requestReviewStatus"]});
                                }
                        } else {
                            this.myDatasets.push({'filename':x, 'download': null, 'export': null, 'publish': null});
                        }
                    }
                );
             }
             console.log("My Datasets: " + JSON.stringify(this.myDatasets));
             console.log("my Datasets length = " + this.myDatasets.length);
            }
        );
    }

    getRequestReviewStatus(filename) {
        console.log("getRequestReviewStatus called, filename: " + filename);
        let reqBody = {};
        this.userEmail = sessionStorage.getItem("email");
        reqBody['userEmail'] = this.userEmail;
        reqBody['filename'] = filename;
        console.log('getRequestReviewStatus - URI = ' + encodeURI(JSON.stringify(reqBody)) );
        this.gatewayService.get("exportrequeststatus?message=" + encodeURI(JSON.stringify(reqBody))).subscribe(
            (response: any) => {
            var resp = response["Items"][0];
        });
    }

    selectsdcDataset(dataset) {
        this.selectedsdcDataset = dataset;
        this.showDictionary = true;
        console.log('select sdc dataset called - get URL: ' + this.selectedsdcDataset.ReadmeBucket  + '&readmepathkey=' + this.selectedsdcDataset.ReadmePathKey);
        this.gatewayService.get('dataset_dictionary?readmebucket=' + this.selectedsdcDataset.ReadmeBucket + '&readmepathkey=' + this.selectedsdcDataset.ReadmePathKey).subscribe(
            (response: any) => {
                this.dictionary = response.data;
            }, (error: any) => {
                this.showDictionary = false;
                this.snackBar.open('Data Dictionary not available', 'close', {
                    duration: 2000,
                });
            }
        );
    }

    requestMail(BucketName, mailType, datasetName) {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '500px',
            data: { bucketName: BucketName, mailType: mailType, datasetName: datasetName }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('requestMail');
            console.log('The dialog was closed');
        });
    }

    requestExport(BucketName, mailType, datasetName) {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            panelClass: 'custom-export-dialog',
            width: '65vw',
            height: '75vh',
            disableClose: true,
            data: { userBucketName: this.userBucketName, mailType: mailType, datasetName: datasetName }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.myDatasets = [];
            this.getMyDatasetsList();
        });
    }
    
    requestTableExport(/*BucketName,*/ mailType) {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            panelClass: 'custom-export-dialog',
            width: '65vw',
            height: '75vh',
            disableClose: true,
            data: { /*userBucketName: this.userBucketName,*/ mailType: mailType }
            });

        dialogRef.afterClosed().subscribe(result => {
                console.log('The Table Export request dialog was closed');
            //this.myDatasets = [];
            //this.getMyDatasetsList();                                                                     
        });
    }   


    requestTrustedStatus(/*BucketName,*/ mailType) {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            panelClass: 'custom-export-dialog',
            width: '65vw',
            height: '75vh',
            disableClose: true,
            data: { /*userBucketName: this.userBucketName,*/ mailType: mailType }
            });

        dialogRef.afterClosed().subscribe(result => {
                console.log('The Trusted Status request dialog was closed');
            //this.myDatasets = [];
            //this.getMyDatasetsList();                                                                     
        });
    }

    uploadFilesToS3(requestType) {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '500px',
            data: { userBucketName: this.userBucketName, requestType: requestType }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The upload files to s3 dialog was closed');
            this.myDatasets = [];
            this.getMyDatasetsList();
        })
    }

    requestDownload() {
      console.log('requestDownload called');
      for(let selectedFile of this.selectedFiles){
        this.myDatasets.forEach((datasetObj, index) => {
            if(selectedFile.filename == datasetObj["filename"]){
                if (datasetObj["download"] == "true"){
                    this.gatewayService.getDownloadUrl('download_url?bucket_name=' + this.userBucketName + '&file_name=' + selectedFile.filename + '&username=' + this.userName).subscribe(
                        (response: any) => {
                        window.open(response, "_blank");
                    });
                }
            }
            else {
                console.log('selected file datasetObj key is not filename');
            }
        });
      }
    }

    getMetadataForS3Objects(filename: string): any{
        var resp;
        console.log('getMetadataForS3Objects called');
        return this.gatewayService.getMetadataOfS3Object('get_metadata_s3?bucket_name=' + this.userBucketName + '&file_name=' + filename).pipe(map(
            (response: any) => {
                resp=response;
                return resp;
        }));     
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
