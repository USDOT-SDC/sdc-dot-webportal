import { Component, OnInit } from '@angular/core';
import {ApiGatewayService} from '../../../services/apigateway.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {MatSnackBar} from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { CognitoService } from '../../../services/cognito.service';
import { environment } from '../../../environments/environment';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { Bool } from 'aws-sdk/clients/inspector';


@Component({
  selector: 'app-workstation',
  templateUrl: './workstation.component.html',
  styleUrls: ['./workstation.component.css']
})
export class WorkstationComponent implements OnInit {
    selectedStack: string;
    stacks: any = [];
    streamingUrl: any;
    //instanceId: any;
    instanceStates: any = {};
    statusProcessing: any = {};
    instanceData: any = [];
    allow_resize: Bool;
    
    private static STREAMING_URL= environment.STREAMING_URL; //Apache Guacamole Streaming Url

    constructor(
        private gatewayService: ApiGatewayService,
        private cognitoService: CognitoService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar) { }

    ngOnInit() {
       // this.instanceId = sessionStorage.getItem('instance-id');
        var stacksString = sessionStorage.getItem('stacks');
        this.stacks = JSON.parse(stacksString);

        for (let stack of this.stacks) {
            this.allow_resize = Boolean(stack.allow_resize)
            if(stack.instance_id) {
                this.getInstanceState(stack.instance_id);

            }
        }
    }

    getBoolean(str) {
        return Boolean(str);
    }

    renderReSizeDialog(stack) {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '700px',
            height: '630px',
            data: { mailType: 'reSize Request', stack, states: this.instanceStates }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    getInstanceState(instanceId:any) {
        this.gatewayService.get('instancestatus?instance_id=' + instanceId).subscribe(
            (response: any) => {
                this.instanceData = response.Status.InstanceStatuses;
                if (this.instanceData.length > 0) {
                    this.instanceStates[instanceId] = response.Status.InstanceStatuses[0].InstanceState.Name;
                    this.statusProcessing[instanceId] = false;
                } else {
                    this.instanceStates[instanceId] = 'stop';
                    this.statusProcessing[instanceId] = false;
                }
            },
            err => {
                this.instanceStates[instanceId] = 'error';
                this.statusProcessing[instanceId] = false;
            }
        );
    }

    instanceAction(instanceId:any,action) {
        this.gatewayService.post('instance?instance_id=' + instanceId + '&action=' + action).subscribe(
            (response: any) => {
                this.statusProcessing[instanceId] = true;
                setTimeout(() =>  {
                   this.getInstanceState(instanceId);
                },
                15000);  
                this.snackBar.open('Instance ' + action + ' successfully', 'close', {
                    duration: 2000,
                });
            }
        );
    }

    launchWorkstation(stack: any) {
      this.selectedStack = stack.stack_name;
      if (this.selectedStack == "Programming_Stack_1"){
        var fleetName = stack.fleet_name;
        this.gatewayService.post('streamingurl?stack_name=' + this.selectedStack + '&fleet_name=' + fleetName + '&username=' + sessionStorage.getItem('username')).subscribe(
            (response: any) => {
                this.streamingUrl = response;
                if (this.streamingUrl != null) {
                    window.open(this.streamingUrl);
                } else {
                    console.log('Failed to launch stack!');
                }
            }
        );
      } else {
        let authToken = this.cognitoService.getIdToken();
        this.streamingUrl = WorkstationComponent.STREAMING_URL + authToken;
        window.open(this.streamingUrl)
      }
    }
}
