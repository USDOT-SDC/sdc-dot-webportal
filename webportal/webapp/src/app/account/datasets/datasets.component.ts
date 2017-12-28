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
    user: any;

    ngOnInit() {
        this.getCuratedDatasets();
        this.getMyDatasetsList();
        this.getPublishedDatasets();
        this.getMyAlgorithmList();
        this.getUserInfo();
    }
    getUserInfo() {
        this.gatewayService.getUserInfo('user').subscribe(
            (response: any) => {
                this.user = response;
                console.log('user = ' + this.user.email);
            }
        );
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
                for (let i = 0; i < response.length; i++) {
                    this.myDatasets.push(response[i]);
                }
            }
        );
    }

    getMyAlgorithmList() {
        this.gatewayService.getMyAlgorithmList('my_algorithm').subscribe(
            (response: any) => {
                for (let j = 0; j < response.length; j++) {
                    this.myDatasets.push(response[j]);
                }
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

    requestMail(BucketName, mailType, datasetName) {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '500px',
            data: { bucketName: BucketName, mailType : mailType, datasetName: datasetName }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });

    }
}
