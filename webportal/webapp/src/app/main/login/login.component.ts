import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute, Params} from '@angular/router';
import { UserService } from "../../../services/user.service";
import { CognitoCallback, LoggedInCallback } from "../../../services/cognito.service";
import { CognitoUtil } from '../../../services/cognito.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements CognitoCallback, LoggedInCallback, OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute, 
    public userService: UserService,
   private cognitoUtil: CognitoUtil) { }

  user: any = {};
  errorMessage: string;
  hash_json:any;

  ngOnInit() {

    if(!this.cognitoUtil.hash_json || !this.cognitoUtil.hash_json['id_token']) {
      // Show adfs login page
      window.location.href = 'https://test-sdc.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=7342nq8oeb2ao2e33pk17bh1q2&redirect_uri=https://d4p2fyeb90av.cloudfront.net/index.html';
    } else {
      // Route to home 
      this.router.navigate(['home']);
    }

    console.log('invoked ...')
    this.activatedRoute.fragment.subscribe((fragment: string) => {
      console.log("Hash fragment is here => ", fragment);
      var hash = fragment;
      this.hash_json = {}
      hash.split('&').map(hk => { 
        let temp = hk.split('='); 
        this.hash_json[temp[0]] = temp[1] 
      });
      this.cognitoUtil.hash_json = this.hash_json;
      console.log(this.hash_json);
    });
  }




  
 
  login() {
    this.errorMessage = null;
    // this.router.navigate(['home']);
    this.userService.authenticate(this.user.username, this.user.password, this);
  }

  cognitoCallback(message: string, result: any) {
      if (message != null) { //error
          this.user = {};
          this.errorMessage = message;
      } else { //success
          this.router.navigate(['home']);
      }
    }

  isLoggedIn(message: string, isLoggedIn: boolean) {
      if (isLoggedIn)
          this.router.navigate(['home']);
  }

}
