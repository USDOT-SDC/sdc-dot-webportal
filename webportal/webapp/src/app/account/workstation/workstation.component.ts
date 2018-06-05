import { Component, OnInit } from '@angular/core';
import {ApiGatewayService} from '../../../services/apigateway.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {MatSnackBar} from '@angular/material';
import { CognitoService } from '../../../services/cognito.service';

@Component({
  selector: 'app-workstation',
  templateUrl: './workstation.component.html',
  styleUrls: ['./workstation.component.css']
})
export class WorkstationComponent implements OnInit {
    selectedStack: string;
    stacks: any = [];
    streamingUrl: any;
    instanceId: any;
    instanceState: string;
    instanceData: any = [];

    constructor(
        private gatewayService: ApiGatewayService,
        private cognitoService: CognitoService,
        public snackBar: MatSnackBar) { }

    ngOnInit() {
        this.instanceId = sessionStorage.getItem('instance-id');
        var stacksString = sessionStorage.getItem('stacks');
        this.stacks = JSON.parse(stacksString);
        if (this.instanceId) {
            this.getInstanceState();
        }
    }

    getInstanceState() {
        this.gatewayService.get('instancestatus?instance_id=' + this.instanceId).subscribe(
            (response: any) => {
                this.instanceData = response.Status.InstanceStatuses;
                if (this.instanceData.length > 0) {
                    this.instanceState = response.Status.InstanceStatuses[0].InstanceState.Name;
                } else {
                    this.instanceState = 'stop';
                }
            }
        );

    }

    instanceAction(action) {
        this.gatewayService.post('instance?instance_id=' + this.instanceId + '&action=' + action).subscribe(
            (response: any) => {
                this.getInstanceState();
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
        this.streamingUrl = "https://dev-stream.securedatacommons.com:8443/guacamole/?authToken="+authToken;
        window.open(this.streamingUrl)
      }
    }
}
