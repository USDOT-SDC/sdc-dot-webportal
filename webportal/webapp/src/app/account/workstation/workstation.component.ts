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
        this.instanceId = sessionStorage.getItem('instance-id')
        if(this.instanceId) {
            this.getInstanceState()
        }
    }

    getInstanceState() {
        this.gatewayService.get('instancestatus?instance_id=' + this.instanceId).subscribe(
            (response: any) => {
                this.instanceState = response
            }
        )

    }

    launchWorkstation(stack: any) {
        this.selectedStack = stack;
        this.gatewayService.get('streaming-url?stack_name=' + this.selectedStack).subscribe(
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
