import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from './app.routes';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserXhr } from '@angular/http';
import { MatButtonModule, MatCheckboxModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatRadioModule, MatTabsModule } from '@angular/material';
import { MatExpansionModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatOptionModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { AboutComponent } from './main/about/about.component';
import { HomeFaqComponent } from './main/faq/faq.component';
import { AccountComponent } from './account/account.component';
import { DatasetsComponent } from './account/datasets/datasets.component';
import { AccountHomeComponent } from './account/accounthome/accounthome.component';
import { CognitoService } from '../services/cognito.service';
import { ApiGatewayService } from '../services/apigateway.service';
import { WorkstationComponent } from './account/workstation/workstation.component';
import { RegisterComponent } from './main/register/register.component';
import { ToastyModule } from 'ng2-toasty';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogBoxComponent } from './account/dialog-box/dialog-box.component';
import { MarkdownModule } from 'ngx-md';
import { FaqComponent } from './account/faq/faq.component';
import { DatasetinfoComponent } from './main/datasetinfo/datasetinfo.component';
import {PanelModule,SharedModule} from 'primeng/primeng';
import {RadioButtonModule} from 'primeng/primeng';
import { ExportRequestsComponent } from './account/exportrequests/exportrequests.component';
import {MessageModule} from 'primeng/message';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HomeComponent,
    AboutComponent,
    AccountComponent,
    AccountHomeComponent,
    DatasetsComponent,
    ExportRequestsComponent,
    WorkstationComponent,
    RegisterComponent,
    DialogBoxComponent,
    FaqComponent,
    HomeFaqComponent,
    DatasetinfoComponent,
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTabsModule,
    CdkTableModule,
    TableModule,
    FileUploadModule,
    SharedModule,
    PanelModule,
    RadioButtonModule,
    MessageModule,
    MarkdownModule.forRoot(),
    ToastyModule.forRoot(),
  ],
  exports: [BrowserModule, ToastyModule],
  providers: [
    CognitoService,
    ApiGatewayService,
    //{ provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
   // { provide: BrowserXhr, useClass: NgProgressBrowserXhr }
  ],
  entryComponents: [DialogBoxComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
