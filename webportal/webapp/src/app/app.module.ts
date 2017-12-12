import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { RoutingModule } from './app.routes'

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { LoginComponent } from './main/login/login.component';
import { AboutComponent } from './main/about/about.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { SettingsComponent } from './user-home/settings/settings.component'

import { CognitoUtil } from '../services/cognito.service'
import { UserService } from '../services/user.service';
import { AccountComponent } from './user-home/account/account.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainComponent,
    LoginComponent,
    AboutComponent,
    UserHomeComponent,
    SettingsComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule
  ],
  providers: [
    CognitoUtil,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
