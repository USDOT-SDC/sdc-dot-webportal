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

    ngOnInit() {
        var sdcDatasetsString = sessionStorage.getItem('datasets');
        this.sdcElements = JSON.parse(sdcDatasetsString);
        var stacksString = sessionStorage.getItem('stacks');
        this.userBucketName = sessionStorage.getItem('team_bucket_name');
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
        
        this.cols = [
          { field: 'filename', header: 'Filename' },
          { field: 'export', header: 'Export' },
          { field: 'publish', header: 'Publish' }
        ]
        let trustedStatus = sessionStorage.getItem('userTrustedStatus');
        console.log("Trusted status"+trustedStatus);
        this.userTrustedStatus = JSON.parse(trustedStatus);
        console.log("Trusted status"+ JSON.stringify(this.userTrustedStatus));
    }

    getMyDatasetsList() {
        this.gatewayService.get('user_data?userBucketName=' + this.userBucketName).subscribe(
            (response: any) => {
            for(let x of response) {
                this.getMetadataForS3Objects(x).subscribe(
                    metadata => {
                        if (metadata != null) {
                               let  trusted = false;
                                // check if user is trutsted for a dataset
                                for( var dt in this.userTrustedStatus) {
                                    //console.log(dt);
                                    //console.log()
                                    if(dt in metadata) {
                                        this.myDatasets.push({'filename':x, 'download': 'true', 'export': 'false', 'publish': 'true'});
                                        trusted = true;
                                    }
                                }
                                if(!trusted) {
                                    this.myDatasets.push({'filename':x, 'download': metadata["download"], 'export': metadata["export"], 'publish': metadata["publish"]});
                                }
                        } else {
                            this.myDatasets.push({'filename':x, 'download': null, 'export': null, 'publish': null});
                        }
                    }
                );
             }
             console.log(this.myDatasets);
            }
        );
    }
    
    selectsdcDataset(dataset) {
        this.selectedsdcDataset = dataset;
        this.showDictionary = true;
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
            console.log('The dialog was closed');
        });
    }

    requestExport(BucketName, mailType, datasetName) {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '700px',
            height: '550px',
            data: { userBucketName: this.userBucketName, mailType: mailType, datasetName: datasetName }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    uploadFilesToS3(requestType) {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '500px',
            data: { userBucketName: this.userBucketName, requestType: requestType }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The upload dialog was closed');
            this.myDatasets = [];
            this.getMyDatasetsList();
        })
    }

    requestDownload() {
      for(let selectedFile of this.selectedFiles){
        this.myDatasets.forEach((datasetObj, index) => {
            if(selectedFile.filename == datasetObj["filename"]){
                if (datasetObj["download"] == "true"){
                    this.gatewayService.getDownloadUrl('download_url?bucket_name=' + this.userBucketName + '&file_name=' + selectedFile.filename).subscribe(
                        (response: any) => {
                        window.open(response, "_blank");
                    });
                }
            }
        });
      }
    }

    getMetadataForS3Objects(filename: string): any{
        var resp;
        return this.gatewayService.getMetadataOfS3Object('get_metadata_s3?bucket_name=' + this.userBucketName + '&file_name=' + filename).map(
            (response: any) => {
                resp=response;
                return resp;
        });     
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
