import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ApiGatewayService } from '../../../services/apigateway.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.css']
})
export class DatasetsComponent implements OnInit {
    constructor(private gatewayService: ApiGatewayService,
                public snackBar: MatSnackBar) {}
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

    requestMail(BucketName) {
        this.gatewayService.sendRequestMail('access_dataset?sender=' + 'pallavi.giri@reancloud.com' + '&bucket_name=' + BucketName).subscribe(
            (response: any) => {
                this.snackBar.open('Your request has been sent successfully', 'close', {
                    duration: 2000,
                });
                console.log('Access Request Sent Successfully');
            }
        );
    }
}
