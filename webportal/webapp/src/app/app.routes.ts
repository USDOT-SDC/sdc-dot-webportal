import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { AboutComponent } from './main/about/about.component';
import { HomeFaqComponent } from './main/faq/faq.component';
import { AccountComponent } from './account/account.component';
import { AccountHomeComponent } from './account/accounthome/accounthome.component';
import { DatasetsComponent } from './account/datasets/datasets.component';
import { WorkstationComponent } from './account/workstation/workstation.component';
import { RegisterComponent } from './main/register/register.component';
import { FaqComponent } from './account/faq/faq.component';
import { DatasetinfoComponent } from './main/datasetinfo/datasetinfo.component';
import { ExportRequestsComponent } from './account/exportrequests/exportrequests.component';
import { LoginSyncComponent } from './account/loginsync/components/loginsync.component';
import { LoginSyncGuard } from './account/loginsync/guards/loginsync.guard';

const appRoutes: Routes = [
    {
        path: '', component: MainComponent, children: [
            { path: '', redirectTo: '/home', pathMatch: 'full' },
            { path: 'index.html', component: HomeComponent, canActivate: [ LoginSyncGuard ] },
            { path: 'home', component: HomeComponent },
            { path: 'about', component: AboutComponent },
            { path: 'datasetinfo', component: DatasetinfoComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'faqs', component: HomeFaqComponent },
        ],
    },
    {
        path: 'account', component: AccountComponent, children: [
            { path: '', redirectTo: 'accounthome', pathMatch: 'prefix' },
            { path: 'accounthome', component: AccountHomeComponent, canActivate: [ LoginSyncGuard ] },
            { path: 'datasets', component: DatasetsComponent },
            { path: 'exportrequests', component: ExportRequestsComponent },
            { path: 'workstation', component: WorkstationComponent },
            { path: 'faq', component: FaqComponent },
            { path: 'loginsync', component: LoginSyncComponent },
        ],
    }
];
export const RoutingModule = RouterModule.forRoot(appRoutes);
