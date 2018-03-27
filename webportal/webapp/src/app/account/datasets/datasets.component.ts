import { Component, OnInit } from '@angular/core';
import { ApiGatewayService } from '../../../services/apigateway.service';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

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
    user: any;
    selectedsdcDataset: any = {};
    dictionary: string;
    showDictionary: boolean = false;

    ngOnInit() {
        var sdcDatasetsString = sessionStorage.getItem('datasets');
        this.sdcElements = JSON.parse(sdcDatasetsString);
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
    }

    getMyDatasetsList() {
        this.gatewayService.get('user_data').subscribe(
            (response: any) => {
                this.myDatasets = response;
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
}
