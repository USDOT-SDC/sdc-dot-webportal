import { Component, OnInit } from '@angular/core';
import {ApiGatewayService} from '../../../services/apigateway.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {MatSnackBar} from '@angular/material';

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
    instanceState: any;

    constructor(
        private gatewayService: ApiGatewayService,
        public snackBar: MatSnackBar) { }

    ngOnInit() {
        this.instanceId = sessionStorage.getItem('instance-id');
        var stacksString = sessionStorage.getItem('stacks');
        this.stacks = JSON.parse(stacksString);
        console.log(this.stacks);
        if (this.instanceId) {
            this.getInstanceState();
        }
    }

    getInstanceState() {
        this.gatewayService.get('instancestatus?instance_id=' + this.instanceId).subscribe(
            (response: any) => {
                this.instanceState = response;
                console.log("instanceState = " + this.instanceState);
            }
        );

    }

    instanceAction(action) {
        this.gatewayService.post('instance?instance_id=' + this.instanceId + '&action=' + action).subscribe(
            (response: any) => {
                console.log(response);
                this.snackBar.open('Instance ' + action + ' successfully', 'close', {
                    duration: 2000,
                });
            }
        );
    }

    launchWorkstation(stack: any) {
        this.selectedStack = stack.stack_name;
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
    }

}
