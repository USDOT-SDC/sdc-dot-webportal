import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from './app.routes';
import { HttpModule } from '@angular/http';
// import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatTableModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { AboutComponent } from './main/about/about.component';
import { AccountComponent } from './account/account.component';
import { DatasetsComponent } from './account/datasets/datasets.component';
import { AccountHomeComponent } from './account/accounthome/accounthome.component';
import { CognitoService } from '../services/cognito.service';
import { ApiGatewayService } from '../services/apigateway.service';
import { WorkstationComponent } from './account/workstation/workstation.component';
import { RegisterComponent } from './main/register/register.component';
import { ToastyModule } from 'ng2-toasty';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HomeComponent,
    AboutComponent,
    AccountComponent,
    AccountHomeComponent,
    DatasetsComponent,
    WorkstationComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatExpansionModule,
    MatSnackBarModule,
    // MatAccordion,
    ToastyModule.forRoot(),
  ],
  exports: [BrowserModule, ToastyModule],
  providers: [
    CognitoService,
    ApiGatewayService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
