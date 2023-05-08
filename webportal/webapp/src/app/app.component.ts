import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { windowProvider, WindowToken } from "../factories/window.factory";
import { ApiGatewayService } from "../services/apigateway.service";
import { CognitoService } from "../services/cognito.service";
import { LoginSyncGuard } from "./account/loginsync/guards/loginsync.guard";
import { LoginSyncService } from "./account/loginsync/services/loginsyncservice.service";
import { LoaderInterceptor } from "./account/services/loader.interceptor";
import { LoaderService } from "./account/services/loader.service";
import { MatNativeDateModule } from "@angular/material/core";
//import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, MatNativeDateModule],
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  //   providers: [
  //     CognitoService,
  //     ApiGatewayService,
  //     LoginSyncService,
  //     LoginSyncGuard,
  //     LoaderService,
  //     LoaderInterceptor,
  //     { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  //     { provide: WindowToken, useFactory: windowProvider }
  // ],
})
export class AppComponent {
  title = "app";
}
