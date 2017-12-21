import { Component, OnInit } from '@angular/core';
import {ApiGatewayService} from '../../../services/apigateway.service';

@Component({
  selector: 'app-workstation',
  templateUrl: './workstation.component.html',
  styleUrls: ['./workstation.component.css']
})
export class WorkstationComponent implements OnInit {
    selectedStack: string;
    stacks: any = [];
    streamingUrl: any;

    constructor(
        private gatewayService: ApiGatewayService) { }

    ngOnInit() {
        this.getAssociatedStacks();
    }

    getAssociatedStacks() {
        this.gatewayService.get('stacks').subscribe(
            (response: any) => {
                this.stacks = response;
            }
        );
    }

    launchWorkstation() {
        this.gatewayService.get('streaming-url?stack_name=' + this.selectedStack).subscribe(
            (response: any) => {
                this.streamingUrl = response;
                if (this.streamingUrl != null) {
                    window.open(this.streamingUrl);
                } else {
                    console.log('Failed to launch stack!');
                    alert('Failed to launch stack!');
                }
            }
        );
    }

    selectStack(stack: any) {
        this.selectedStack = stack;
    }


}
