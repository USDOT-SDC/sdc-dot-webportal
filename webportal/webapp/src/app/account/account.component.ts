import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CognitoService } from "../../services/cognito.service";
import { ApiGatewayService } from "../../services/apigateway.service";
import * as $ from "jquery";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"],
  providers: [
    CognitoService,
    ApiGatewayService,
    // LoginSyncService,
    // LoginSyncGuard,
    // LoaderService,
    // LoaderInterceptor,
    // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    // { provide: WindowToken, useFactory: windowProvider }
  ],
})
export class AccountComponent implements OnInit {
  constructor(
    private cognitoService: CognitoService,
    private gatewayService: ApiGatewayService,
    private router: Router
  ) {}
  isDataProvider: any;

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.gatewayService.getUserInfo("user").subscribe((response: any) => {
      sessionStorage.setItem("username", response.username);
      sessionStorage.setItem("response", response);
      sessionStorage.setItem(
        "upload_locations",
        JSON.stringify(response.upload_locations)
      );
      sessionStorage.setItem("email", response.email);
      sessionStorage.setItem("stacks", JSON.stringify(response.stacks));
      sessionStorage.setItem("datasets", JSON.stringify(response.datasets));
      sessionStorage.setItem("roles", response.role);
      sessionStorage.setItem(
        "userTrustedStatus",
        JSON.stringify(response.userTrustedStatus)
      );
      sessionStorage.setItem(
        "userAutoExportStatus",
        JSON.stringify(response.userAutoExportStatus)
      );
      // Extract and exportWorkflow all exportWorkflow from datasets
      let combinedEW = {};
      var isDataProvider = "false";
      for (let dset in response.datasets) {
        //alert(JSON.stringify(response.datasets[dset]));
        let key = "exportWorkflow";
        let dtEWExists = key in response.datasets[dset];
        if (dtEWExists) {
          $.extend(combinedEW, response.datasets[dset]["exportWorkflow"]);
        }
        var exportWorkflow = JSON.stringify(
          response.datasets[dset]["exportWorkflow"]
        );
        if (exportWorkflow && exportWorkflow.includes(response.email)) {
          this.isDataProvider = "true";
          sessionStorage.setItem("isDataProvider", isDataProvider);
        }
      }
      sessionStorage.setItem("exportWorkflow", JSON.stringify(combinedEW));
      for (var i = 0; i < response.stacks.length; i++) {
        if (response.stacks[i].instance_id) {
          sessionStorage.setItem("instance-id", response.stacks[i].instance_id);
          sessionStorage.setItem(
            "team_bucket_name",
            response.stacks[i].team_bucket_name
          );
        }
      }
    });
  }

  appendToStorage(name, data) {
    var old = sessionStorage.getItem(name);
    if (old === null) old = "";
    sessionStorage.setItem(name, old + data);
  }

  userLogout() {
    this.cognitoService.logout();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(["/"]);
  }
}
