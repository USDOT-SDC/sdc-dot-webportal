import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounthome',
  templateUrl: './accounthome.component.html',
  styleUrls: ['./accounthome.component.css']
})
export class AccountHomeComponent implements OnInit {

  constructor( public router: Router ) { }

  ngOnInit() {
  }
}
