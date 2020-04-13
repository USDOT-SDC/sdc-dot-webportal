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
    if(!this.isValidPassword()) {
      this.passwordMatch = false;
      this.errorMessage = "The password does not match the required criteria. It must be 7 characters long and contain at least 3 of the following: lower case letter, upper case letter, special character, or number."
    }
    else if(this.password != this.password_confirm) {
      this.passwordMatch = false;
      this.errorMessage = "Passwords must match."
    } else {
      this.passwordMatch = true;
      this.errorMessage = "";
    }
  }

  isValidPassword() {
    var hasUpperCase = /[A-Z]/.test(this.password) ? 1 : 0;
    var hasLowerCase = /[a-z]/.test(this.password) ? 1 : 0;
    var hasNumbers = /\d/.test(this.password) ? 1 : 0;
    var hasSpecialCharacters = /\W/.test(this.password) ? 1 : 0;
    var hasSevenCharacters = this.password.length >= 7;

    return (hasSevenCharacters && ((hasUpperCase + hasLowerCase + hasNumbers + hasSpecialCharacters) >= 3));
  }
}
