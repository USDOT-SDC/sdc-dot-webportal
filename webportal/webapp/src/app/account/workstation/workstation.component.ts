import { Component, OnInit } from '@angular/core';
import {ApiGatewayService} from '../../../services/apigateway.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

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
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig) { }

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
        this.gatewayService.get('instance?instance_id=' + this.instanceId + '&action=' + action).subscribe(
            (response: any) => {
                console.log(response);
            }
        );
    }

    launchWorkstation(stack: any) {
        this.selectedStack = stack.stack_name;
        var fleetName = stack.fleet_name;
        this.gatewayService.get('streamingurl?stack_name=' + this.selectedStack + '&fleet_name=' + fleetName + '&username=' + sessionStorage.getItem('username')).subscribe(
            (response: any) => {
                this.toastyService.success('Successfully launch stack');
                this.streamingUrl = response;
                if (this.streamingUrl != null) {
                    window.open(this.streamingUrl);
                } else {
                    console.log('Failed to launch stack!');
                    this.toastyService.error('Failed to launch stack');
                }
            }
        );
    }

}
