import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { enableProdMode, importProvidersFrom } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { provideRouter } from "@angular/router";
import { LoginSyncGuard } from "./app/account/loginsync/guards/loginsync.guard";
import {
  LoginSyncService,
  AuthInterceptorLogin,
} from "./app/account/loginsync/services/loginsyncservice.service";
import { LoaderInterceptor } from "./app/account/services/loader.interceptor";
import { LoaderService } from "./app/account/services/loader.service";
import { AppComponent } from "./app/app.component";

import { AppModule } from "./app/app.module";
import { APP_Routes } from "./app/app.routes";
import { environment } from "./environments/environment";
import { windowProvider, WindowToken } from "./factories/window.factory";
import {
  ApiGatewayService,
  AuthInterceptor,
} from "./services/apigateway.service";
import { CognitoService } from "./services/cognito.service";
import { provideAnimations } from "@angular/platform-browser/animations";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  MarkdownComponent,
  MarkdownModule,
  MarkdownService,
} from "ngx-markdown";

if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.log(err));

bootstrapApplication(AppComponent, {
  providers: [
    //{provide: APP_BASE_HREF, useValue: '/'},
    CognitoService,
    ApiGatewayService,
    LoginSyncService,
    LoginSyncGuard,
    MatSnackBar,
    LoaderService,

    provideAnimations(),
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorLogin, multi: true },
    { provide: WindowToken, useFactory: windowProvider },
    //{ provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    // { provide: BrowserXhr, useClass: NgProgressBrowserXhr }
    provideRouter(APP_Routes),
    importProvidersFrom(MarkdownModule.forRoot()),
  ],
});
