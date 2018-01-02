import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import { ApiGatewayService } from '../../../services/apigateway.service';
import {message} from 'aws-sdk/clients/sns';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent implements OnInit {
    fileName: string;
    mailType: string;
    message: string;
    datasetName: string;
    userEmail: string;
    userName: string;
    dataTypes = [
        {value: 'dataset', viewValue: 'Dataset'},
        {value: 'algorithm', viewValue: 'Algorithm'},
    ];
    messageModel = {
        stateList: '',
        fileName: '',
        type: '',
        bucketName: ''
    };
    constructor(private gatewayService: ApiGatewayService, public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<DialogBoxComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {    this.messageModel.bucketName = data.bucketName;
                                                        this.mailType = data.mailType;
                                                        this.datasetName = data.datasetName;
                                                    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    ngOnInit() {
        this.userEmail = sessionStorage.getItem('email');
        this.userName = sessionStorage.getItem('username');

    }


    sendMail() {
        if (this.mailType === 'Access Request Mail') {
            this.message =  '<div>' +
                '    Hello,<br><br>' +
                '    Please approve the request for Dataset Access.<br>' +
                '    <ul>' +
                '        <li>Bucket Name = ' + this.messageModel.bucketName + '</li>' +
                '        <li>State List = ' + this.messageModel.stateList + '</li>' +
                '    </ul>' +
                '    Thanks, <br>' + this.userName +
                '</div>';
        } else {
            this.message = '<div> Hello,<br><br>Please approve the request for publishing the datasets.<br>' +
                '    <ul>' +
                '        <li>Dataset / Algorithm Name = ' + this.datasetName + '</li>' +
                '        <li>File Name = ' + this.messageModel.fileName + '</li>' +
                '        <li>Type = ' + this.messageModel.type + '</li>' +
                '    </ul>' +
                '    Thanks, <br>' + this.userName +
                '</div>';
        }
        this.gatewayService.sendRequestMail('send_email?sender=' + this.userEmail + '&message=' + this.message).subscribe(
            (response: any) => {
                this.snackBar.open('Your request has been sent successfully', 'close', {
                    duration: 2000,
                });
                this.onNoClick();
                console.log('Access Request Sent Successfully');
            }
        );
    }

}
