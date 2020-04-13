import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})

export class PasswordResetComponent implements OnInit {
  password: string;
  password_confirm: string;
  errorMessage = '';
  passwordMatch = true;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    if(this.password != this.password_confirm) {
      this.passwordMatch = false;
      this.errorMessage = "Passwords must match."
    }
  }
}
