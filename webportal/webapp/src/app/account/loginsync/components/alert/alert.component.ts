import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-alert',
  styleUrls: ['./alert.component.css'],
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {
  @Input() showAlert: boolean;
  @Input() text: string;

  constructor() { }
  ngOnInit(): void {}
}
