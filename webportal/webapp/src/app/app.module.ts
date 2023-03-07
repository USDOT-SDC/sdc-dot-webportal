import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, ROUTES } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { BrowserXhr } from '@angular/http';
//import { MatButtonModule, MatCheckboxModule, MatCardModule, MatMenuModule, MatTooltipModule, MatToolbarModule, MatIconModule, MatRadioModule, MatTabsModule, MatProgressSpinnerModule } from '@angular/material';
//import { MatExpansionModule, MatDialogModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatSelectModule, MatOptionModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';  
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';     //MatOption is  imported from MatSelectModule not MatOptionModule
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { WindowToken, windowProvider } from '../factories/window.factory';
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
//import { ToastyModule } from 'ng2-toasty';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogBoxComponent } from './account/dialog-box/dialog-box.component';
//import { MarkdownModule } from 'ngx-md';
import { MarkdownModule } from 'ngx-markdown';
import { FaqComponent } from './account/faq/faq.component';
import { DatasetinfoComponent } from './main/datasetinfo/datasetinfo.component';
import { PanelModule } from 'primeng/panel';
import { SharedModule } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton'
import { CheckboxModule } from 'primeng/checkbox';
import { ExportRequestsComponent } from './account/exportrequests/exportrequests.component';
import { MessageModule } from 'primeng/message';
import { LoginSyncComponent } from './account/loginsync/components/loginsync.component';
import { AlertComponent } from './account/components/alert/alert.component';
//import { TogglePasswordDirective } from './account/loginsync/directives/togglepassword.directive';
import { LoginSyncGuard } from './account/loginsync/guards/loginsync.guard';
import { LoginSyncService } from './account/loginsync/services/loginsyncservice.service';
import { LoaderComponent } from './account/components/loader/loader.component';
import { LoaderService } from './account/services/loader.service';
import { LoaderInterceptor } from './account/services/loader.interceptor';
import { ButtonModule } from 'primeng/button';
import { MatExpansionPanel } from '@angular/material/expansion';

@NgModule({
    declarations: [
        MainComponent,
        HomeComponent,
        AboutComponent,
        AccountComponent,
        //AccountHomeComponent,
        DatasetsComponent,
        //ExportRequestsComponent,
        WorkstationComponent,
        RegisterComponent,
        DialogBoxComponent,
        FaqComponent,
        HomeFaqComponent,
        DatasetinfoComponent,
        LoginSyncComponent,
        //AlertComponent,
        //TogglePasswordDirective,
        //LoaderComponent
    ],
    imports: [
        BrowserModule,
        //RouterModule,
        NgModule,
        FormsModule,
        //RoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatCardModule,
        MatMenuModule,
        MatTooltipModule,
        MatToolbarModule,
        MatIconModule,
        MatRadioModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        MatDialogModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTableModule,
        CdkTableModule,
        TableModule,
        FileUploadModule,
        AppComponent,
        MainComponent,
        HomeComponent,
        AboutComponent,
        HomeFaqComponent,
        AccountComponent,
        DatasetsComponent,
        AccountHomeComponent,
        CognitoService,
        ApiGatewayService,
        WorkstationComponent,
        RegisterComponent,
        MatSnackBarModule,
        DialogBoxComponent,
        MarkdownModule,
        FaqComponent,
        DatasetinfoComponent,
        PanelModule,
        SharedModule,
        RadioButtonModule,
        CheckboxModule,
        ExportRequestsComponent,
        MessageModule,
        LoginSyncComponent,
        //AlertComponent,
        //TogglePasswordDirective,
        LoginSyncGuard,
        LoginSyncService,
        //LoaderComponent,
        LoaderService,
        LoaderInterceptor,
        ButtonModule
    ],
    //schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],
    //exports: [BrowserModule, ToastyModule, RouterModule ],
    //exports: [BrowserModule],
    // providers: [
    //     //{provide: APP_BASE_HREF, useValue: '/'},
    //     CognitoService,
    //     ApiGatewayService,
    //     LoginSyncService,
    //     LoginSyncGuard,
    //     LoaderService,
    //     { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    //     { provide: WindowToken, useFactory: windowProvider },
    //     //{ provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
    //     // { provide: BrowserXhr, useClass: NgProgressBrowserXhr }
    // ],
    //entryComponents: [DialogBoxComponent],    //TO DO: this was removed by ng update during angular v13 migration.... added back as a comment & is pending research
    bootstrap: [AppComponent]
})
export class AppModule { }
