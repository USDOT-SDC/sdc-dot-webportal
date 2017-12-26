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
    datasets: any = [];
    datasetsPublished = [{
            'DatasetType': 'Published',
            'DatasetCode': 'WAZE',
            'Description': 'Contains curated waze data',
            'BucketName': 'dev-dot-sdc-curated-911061262852-us-east-1'
        } , {
            'DatasetType': 'Published',
            'DatasetCode': 'Here',
            'Description': 'Contains curated waze data',
            'BucketName': 'dev-dot-sdc-curated-911061262852-us-east-1'
        } , {
        'DatasetType': 'Published',
            'DatasetCode': 'Speed',
            'Description': 'Contains curated waze data',
            'BucketName': 'dev-dot-sdc-curated-911061262852-us-east-1'
        } ,
    ];

    ngOnInit() {
        this.getDatasets();
    }

    getDatasets() {
        this.gatewayService.getDatasets('datasets?datasetcode=' + 'WAZE' + '&datasettype=' + 'Curated').subscribe(
            (response: any) => {
                this.datasets.push(response);
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
