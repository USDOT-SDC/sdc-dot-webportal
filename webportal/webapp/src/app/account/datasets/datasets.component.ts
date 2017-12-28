import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
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
                public dialog: MatDialog) {}
    curatedDatasets: any = [];
    myDatasets: any = [];
    publishedDatasets = [];

    ngOnInit() {
        this.getCuratedDatasets();
        this.getMyDatasetsList();
        this.getPublishedDatasets();
    }

    getCuratedDatasets() {
        this.gatewayService.getCuratedDatasets('datasets?datasetcode=' + 'WAZE' + '&datasettype=' + 'Curated').subscribe(
            (response: any) => {
                this.curatedDatasets.push(response);
            }
        );
    }

    getMyDatasetsList() {
        this.gatewayService.getMyDatasetsList('my_datasets').subscribe(
            (response: any) => {
                this.myDatasets = response;
            }
        );
    }

    getPublishedDatasets() {
        this.gatewayService.getPublishedDatasets('datasets?datasetcode=' + 'WAZE' + '&datasettype=' + 'Published').subscribe(
            (response: any) => {
                this.publishedDatasets.push(response);
            }
        );
    }

    requestMail(BucketName, mailType) {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '500px',
            data: { bucketName: BucketName, mailType : mailType }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });

    }
}
