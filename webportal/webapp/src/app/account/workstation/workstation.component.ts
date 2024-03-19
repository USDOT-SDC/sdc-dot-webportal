import { Component, OnInit } from "@angular/core";
import { ApiGatewayService } from "../../../services/apigateway.service";
//import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { MatSnackBar } from "@angular/material/snack-bar";
//import {MatDialogModule} from '@angular/material/dialog';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Router, RouterModule, NavigationStart } from "@angular/router";
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { CognitoService } from "../../../services/cognito.service";
import { environment } from "../../../environments/environment";
import { DialogBoxComponent } from "../dialog-box/dialog-box.component";
import { Bool } from "aws-sdk/clients/inspector";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDialogModule, RouterModule],
  selector: "app-workstation",
  templateUrl: "./workstation.component.html",
  styleUrls: ["./workstation.component.css"],
  providers: [
    CognitoService,
    ApiGatewayService,
    MatDialog,
    MatSnackBar,
    MatDialogModule,
    // LoginSyncService,
    // LoginSyncGuard,
    // LoaderService,
    // LoaderInterceptor,
    // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    // { provide: WindowToken, useFactory: windowProvider }
  ],
})
export class WorkstationComponent implements OnInit {
  selectedStack: string;
  stacks: any = [];
  streamingUrl: any;
  // instanceId: any;
  instanceStates: any = {};
  statusProcessing: any = {};
  instanceData: any = [];
  allow_resize: Bool;
  transformedConfigurations = [];

  constructor(
    private gatewayService: ApiGatewayService,
    private cognitoService: CognitoService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit() {
    this.inactivityTimer();
    this.gatewayService.getUserInfo("user").subscribe((response: any) => {
      sessionStorage.setItem("stacks", JSON.stringify(response.stacks));
      const stacksString = sessionStorage.getItem("stacks");
      this.stacks = JSON.parse(stacksString);
      for (const stack of this.stacks) {
        this.allow_resize = Boolean(stack.allow_resize);
        const config = {};
        stack["current_configuration"].split(",").forEach((element) => {
          // eslint-disable-next-line radix
          config[element.split(":")[0]] = Number(element.split(":")[1]);
        });
        this.transformedConfigurations.push(config);
        if (stack.instance_id) {
          this.getInstanceState(stack.instance_id);
        }
      }
    });
  }

  getBoolean(str) {
    return Boolean(str);
  }

  renderReSizeDialog(stack) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "700px",
      height: "630px",
      data: { mailType: "reSize Request", stack, states: this.instanceStates },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  getInstanceState(instanceId: any) {
    this.gatewayService
      .get("instancestatus?instance_id=" + instanceId)
      .subscribe(
        (response: any) => {
          this.instanceData = response.Status.InstanceStatuses;
          if (this.instanceData.length > 0) {
            this.instanceStates[instanceId] =
              response.Status.InstanceStatuses[0].InstanceState.Name;
            this.statusProcessing[instanceId] = false;
          } else {
            this.instanceStates[instanceId] = "stop";
            this.statusProcessing[instanceId] = false;
          }
        },
        (err) => {
          this.instanceStates[instanceId] = "error";
          this.statusProcessing[instanceId] = false;
        }
      );
  }

  instanceAction(instanceId: any, action) {
    this.gatewayService
      .post("instance?instance_id=" + instanceId + "&action=" + action)
      .subscribe((response: any) => {
        this.statusProcessing[instanceId] = true;
        setTimeout(() => {
          this.getInstanceState(instanceId);
        }, 15000);
        this.snackBar.open("Instance " + action + " successfully", "close", {
          duration: 2000,
        });
      });
  }

  async launchWorkstation(stack: any) {
    this.selectedStack = stack.stack_name;
    if (this.selectedStack === "Programming_Stack_1") {
      const fleetName = stack.fleet_name;
      // eslint-disable-next-line max-len
      this.gatewayService
        .post(
          "streamingurl?stack_name=" +
            this.selectedStack +
            "&fleet_name=" +
            fleetName +
            "&username=" +
            sessionStorage.getItem("username")
        )
        .subscribe((response: any) => {
          this.streamingUrl = response;
          if (this.streamingUrl != null) {
            window.open(this.streamingUrl);
          } else {
            console.log("Failed to launch stack!");
          }
        });
    } else {
      const authToken = await this.cognitoService.getIdToken();
      console.log("ID Token after hitting workstation ==", authToken);
      this.streamingUrl =
        `${window.location.origin}/guacamole/?authToken=` + authToken;
      window.open(this.streamingUrl);
    }
  }

  // inactivityTimer() {
  //   let sessionTimer: any;
  //   let warningTimer: any;
  //   let sessionStart: number;
  //   const sessionTimeout = 1200000; // 20 minutes in milliseconds
  //   const warningTime = 900000; // 15 minutes in milliseconds

  //   const isSessionExpired = () => {
  //     return Date.now() - sessionStart < sessionTimeout;
  //   };

  //   const startSessionTimer = () => {
  //     sessionTimer = setTimeout(() => {
  //       alert(
  //         "Your session has expired due to inactivity. You have been logged out."
  //       );
  //       this.userLogout();
  //     }, sessionTimeout);
  //   };

  //   const showWarningAlert = () => {
  //     warningTimer = setTimeout(() => {
  //       alert(
  //         "Your session is about to expire due to inactivity. Please continue your session or you will be logged out."
  //       );
  //       if (isSessionExpired()) {
  //         this.refreshPage();
  //       }
  //     }, warningTime);
  //   };

  //   const resetTimers = () => {
  //     clearTimeout(sessionTimer);
  //     clearTimeout(warningTimer);
  //   };

  //   const clearEventListeners = () => {
  //     window.removeEventListener("beforeunload", resetTimers);
  //     window.removeEventListener("visibilitychange", handleVisibilityChange);
  //     window.removeEventListener("unload", clearEventListeners);
  //   };

  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "visible") {
  //       resetTimers(); // Reset the timer when the page becomes visible (e.g., when switching tabs)
  //     }
  //   };

  //   sessionStart = Date.now();
  //   startSessionTimer();
  //   showWarningAlert();

  //   window.addEventListener("beforeunload", resetTimers);

  //   window.addEventListener("visibilitychange", handleVisibilityChange);

  //   window.addEventListener("unload", clearEventListeners);

  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationStart) {
  //       clearTimeout(sessionTimer);
  //       clearTimeout(warningTimer);
  //       clearEventListeners();
  //     }
  //   });
  // }

  // refreshPage() {
  //   window.location.reload(); // Refresh the page
  // }

  // userLogout() {
  //   this.router.navigate(["/"]);
  //   this.cognitoService.logout();
  //   localStorage.clear();
  //   sessionStorage.clear();
  // }
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
