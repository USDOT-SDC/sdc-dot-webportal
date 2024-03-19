import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import {
  NavigationEnd,
  Router,
  NavigationStart,
  ActivatedRoute,
  RouterModule,
} from "@angular/router";
import { CognitoService } from "../../../services/cognito.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule, MatSnackBarModule],
  providers: [CognitoService],
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.css"],
})
export class FaqComponent implements OnInit {
  constructor(
    private router: Router,
    private _activeRouter: ActivatedRoute,
    private cognitoService: CognitoService,
    public snackBar: MatSnackBar
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          const element = document.querySelector("#" + tree.fragment);
          console.log("document" + document);
          if (element) {
            element.scrollIntoView(true);
          }
        }
      }
    });
  }

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
