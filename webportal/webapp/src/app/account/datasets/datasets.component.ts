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
        public dialog: MatDialog) { }
    sdcDatasets: any = [];
    myDatasets = [];
    user: any;

    ngOnInit() {
        this.sdcDatasets = sessionStorage.getItem('datasets')
        this.getMyDatasetsList()
    }

    getMyDatasetsList() {
        this.gatewayService.getMyDatasetsList('userdata').subscribe(
            (response: any) => {
                this.myDatasets = response
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
