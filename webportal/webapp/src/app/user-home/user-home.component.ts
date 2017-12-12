import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  userLogout() {
    // TODO: Call logout: this.userService.logout();
    this.router.navigate(['/']);
  }

}
