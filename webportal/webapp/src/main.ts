import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideRouter } from '@angular/router';
import { LoginSyncGuard } from './app/account/loginsync/guards/loginsync.guard';
import { LoginSyncService } from './app/account/loginsync/services/loginsyncservice.service';
import { LoaderInterceptor } from './app/account/services/loader.interceptor';
import { LoaderService } from './app/account/services/loader.service';
import { AppComponent } from './app/app.component';

import { AppModule } from './app/app.module';
import { APP_Routes } from './app/app.routes';
import { environment } from './environments/environment';
import { windowProvider, WindowToken } from './factories/window.factory';
import { ApiGatewayService } from './services/apigateway.service';
import { CognitoService } from './services/cognito.service';

if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.log(err));

bootstrapApplication(AppComponent, {providers: [
  //{provide: APP_BASE_HREF, useValue: '/'},
  CognitoService,
  ApiGatewayService,
  LoginSyncService,
  LoginSyncGuard,
  LoaderService,
  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  { provide: WindowToken, useFactory: windowProvider },
  //{ provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
  // { provide: BrowserXhr, useClass: NgProgressBrowserXhr }
  provideRouter(APP_Routes)
]})