import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import { ApiGatewayService } from '../../../services/apigateway.service';
import {message} from 'aws-sdk/clients/sns';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent implements OnInit{
    fileName: string;
    mailType: string;
    message: string;
    datasetName: string;
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
        console.log(this.messageModel.bucketName);
        console.log(this.mailType);
    }


    sendMail() {
        if (this.mailType === 'Access Request Mail') {
            this.message = 'This mail is regarding Dataset Access Request : Bucket Name = ' + this.messageModel.bucketName +
                ', State List = ' + this.messageModel.stateList + '.';
        } else {
            this.message = 'This mail is regarding Dataset publish request : Dataset / Algorithm Name = ' + this.datasetName +
                            ', File Name = ' + this.messageModel.fileName + ', Type = ' + this.messageModel.type + '.';
        }
        this.gatewayService.sendRequestMail('send_email?sender=' + 'pallavi.giri@reancloud.com' + '&message=' + this.message).subscribe(
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
