import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { CognitoUtil } from '../../../services/cognito.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
 
  hash_json:any;
  error_message:any;
  saml_response:any;

  constructor(private activatedRoute: ActivatedRoute, private cognitoUtil: CognitoUtil) { 
  }

  ngOnInit() {
   
  }
}
