import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from './app.routes';
//import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { BrowserXhr } from '@angular/http';
//import { MatButtonModule, MatCheckboxModule, MatCardModule, MatMenuModule, MatTooltipModule, MatToolbarModule, MatIconModule, MatRadioModule, MatTabsModule, MatProgressSpinnerModule } from '@angular/material';
//import { MatExpansionModule, MatDialogModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatSelectModule, MatOptionModule } from '@angular/material';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';  
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';     //MatOption is  imported from MatSelectModule not MatOptionModule
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
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
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { DialogBoxComponent } from './account/dialog-box/dialog-box.component';
//import { MarkdownModule } from 'ngx-md';
import { MarkdownModule } from 'ngx-markdown';
import { FaqComponent } from './account/faq/faq.component';
import { DatasetinfoComponent } from './main/datasetinfo/datasetinfo.component';
import { PanelModule, SharedModule} from 'primeng/primeng';
import { RadioButtonModule} from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ExportRequestsComponent } from './account/exportrequests/exportrequests.component';
import { MessageModule } from 'primeng/message';
import { LoginSyncComponent } from './account/loginsync/components/loginsync.component';
import { AlertComponent } from './account/components/alert/alert.component';
import { TogglePasswordDirective } from './account/loginsync/directives/togglepassword.directive';
import { LoginSyncGuard } from './account/loginsync/guards/loginsync.guard';
import { LoginSyncService } from './account/loginsync/services/loginsyncservice.service';
import { LoaderComponent } from './account/components/loader/loader.component';
import { LoaderService } from './account/services/loader.service';
import { LoaderInterceptor } from './account/services/loader.interceptor';

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
        LoginSyncComponent,
        AlertComponent,
        TogglePasswordDirective,
        LoaderComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([]),
        RoutingModule,
        FormsModule,
        //HttpModule,
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
        MatTooltipModule,
        MatFormFieldModule,
        MatDialogModule,
        MatSelectModule,
        //MatOptionModule,
        MatRadioModule,
        MatCheckboxModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        CdkTableModule,
        TableModule,
        FileUploadModule,
        SharedModule,
        PanelModule,
        RadioButtonModule,
        CheckboxModule,
        MessageModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MarkdownModule.forRoot(),
        //ToastyModule.forRoot(),
        //DataTableModule
    ],
    //schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],
    //exports: [BrowserModule, ToastyModule, RouterModule ],
    exports: [BrowserModule, RouterModule],
    providers: [
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
    ],
   //entryComponents: [DialogBoxComponent],    //TO DO: this was removed by ng update during angular v13 migration.... added back as a comment & is pending research
    bootstrap: [AppComponent]
})
export class AppModule { }
