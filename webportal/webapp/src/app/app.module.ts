import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { RoutingModule } from './app.routes'
import { HttpModule } from '@angular/http'
// import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { AboutComponent } from './main/about/about.component';
import { AccountComponent } from './account/account.component';
import { SettingsComponent } from './account/settings/settings.component';
import { MyAccountComponent } from './account/myaccount/myaccount.component';
import { CognitoService } from '../services/cognito.service'
import { ApiGatewayService } from '../services/apigateway.service'


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HomeComponent,
    AboutComponent,
    AccountComponent,
    MyAccountComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    CognitoService,
    ApiGatewayService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
