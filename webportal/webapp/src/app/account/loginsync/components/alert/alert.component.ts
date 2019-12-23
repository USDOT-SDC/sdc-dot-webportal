import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['../../../../../../node_modules/uswds/src/stylesheets/uswds.scss']
})
export class AlertComponent implements OnInit {
  @Input() showAlert: boolean;
  @Input() text: string;

  constructor() { }
  ngOnInit(): void {}
}
