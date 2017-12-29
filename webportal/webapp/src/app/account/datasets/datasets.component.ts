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
    sdcDatasets: any = [];
    myDatasets = [];
    user: any;
    selectedsdcDataset: any = {};
    dictionary: string;
    showDictionary: boolean = false;

    ngOnInit() {
        var sdcDatasetsString = sessionStorage.getItem('datasets');
        this.sdcDatasets = JSON.parse(sdcDatasetsString);
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
        this.gatewayService.get('dataset_dictionary?datasetcode=' + this.selectedsdcDataset.DatasetCode + '&datasettype=' + this.selectedsdcDataset.DatasetType).subscribe(
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
