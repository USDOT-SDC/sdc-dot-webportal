import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Router, RouterModule, NavigationStart } from "@angular/router";
import { CardModule } from "primeng/card";
import { CognitoService } from "../../../services/cognito.service";

import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

@Component({
  standalone: true,
  imports: [
    MatCardModule,
    RouterModule,
    CommonModule,
    CardModule,

    MatSnackBarModule,
  ],
  providers: [CognitoService],
  selector: "app-accounthome",
  templateUrl: "./accounthome.component.html",
  styleUrls: ["./accounthome.component.css"],
})
export class AccountHomeComponent implements OnInit {
  constructor(
    public router: Router,
    private cognitoService: CognitoService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.inactivityTimer();
  }

  inactivityTimer() {
    let sessionTimer: any;
    let warningTimer: any;
    let sessionStart: number;
    const sessionTimeout = 1200000; // 20 minutes in milliseconds
    const warningTime = 1080000; // 18 minutes in milliseconds

    const isSessionExpired = () => {
      return Date.now() - sessionStart > sessionTimeout;
    };

    const startSessionTimer = () => {
      sessionTimer = setTimeout(() => {
        this.userLogout();
      }, sessionTimeout);
    };

    const showWarningAlert = () => {
      warningTimer = setTimeout(() => {
        this.snackBar.open(
          "Your session is about to expire. Please refresh the page.",
          "close",
          {
            duration: 120000,
          }
        );

        if (isSessionExpired()) {
          this.refreshPage();
        }
      }, warningTime);
    };

    const resetTimers = () => {
      clearTimeout(sessionTimer);
      clearTimeout(warningTimer);
    };

    sessionStart = Date.now();
    startSessionTimer();
    showWarningAlert();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        clearTimeout(sessionTimer);
        clearTimeout(warningTimer);
        resetTimers();
      }
    });
  }

  refreshPage() {
    window.location.reload(); // Refresh the page
  }

  userLogout() {
    this.router.navigate(["/"]);
    this.snackBar.open("Your session has expired due to inactivity", "close", {
      duration: 600000,
    });

    this.cognitoService.logout();
    localStorage.clear();
    sessionStorage.clear();
  }
}
