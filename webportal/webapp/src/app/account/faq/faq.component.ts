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

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
  providers: [CognitoService],
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.css"],
})
export class FaqComponent implements OnInit {
  constructor(
    private router: Router,
    private _activeRouter: ActivatedRoute,
    private cognitoService: CognitoService
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
    const warningTime = 900000; // 15 minutes in milliseconds

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
        var notification = new Notification("Alert", {
          body: "Your session is about to expire due to inactivity. Please continue your session or you will be logged out.",
        });

        if (isSessionExpired()) {
          this.refreshPage();
        }
      }, warningTime);
    };

    const resetTimers = () => {
      clearTimeout(sessionTimer);
      clearTimeout(warningTimer);
    };

    const clearEventListeners = () => {
      window.removeEventListener("beforeunload", resetTimers);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("unload", clearEventListeners);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetTimers(); // Reset the timer when the page becomes visible (e.g., when switching tabs)
      }
    };

    sessionStart = Date.now();
    startSessionTimer();
    showWarningAlert();

    window.addEventListener("beforeunload", resetTimers);

    window.addEventListener("visibilitychange", handleVisibilityChange);

    window.addEventListener("unload", clearEventListeners);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        clearTimeout(sessionTimer);
        clearTimeout(warningTimer);
        clearEventListeners();
      }
    });
  }

  refreshPage() {
    window.location.reload(); // Refresh the page
  }

  userLogout() {
    this.router.navigate(["/"]);
    var notification = new Notification("Alert", {
      body: "Your session has expired due to inactivity. You have been logged out.",
    });
    this.cognitoService.logout();
    localStorage.clear();
    sessionStorage.clear();
  }
}
