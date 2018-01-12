import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { AboutComponent } from './main/about/about.component';
import { AccountComponent } from './account/account.component';
import { AccountHomeComponent } from './account/accounthome/accounthome.component';
import { DatasetsComponent } from './account/datasets/datasets.component';
import { WorkstationComponent } from './account/workstation/workstation.component';
import { RegisterComponent } from './main/register/register.component';
import { FaqComponent } from './account/faq/faq.component';
import { DatasetinfoComponent } from './main/datasetinfo/datasetinfo.component';


const appRoutes: Routes = [
    {
        path: '', component: MainComponent, children: [
            { path: '', redirectTo: '/home', pathMatch: 'full' },
            { path: 'index.html', component: HomeComponent },
            { path: 'home', component: HomeComponent },
            { path: 'about', component: AboutComponent },
            { path: 'datasetinfo', component: DatasetinfoComponent },
            { path: 'register', component: RegisterComponent },
        ],
    },
    {
        path: 'account', component: AccountComponent, children: [
            { path: '', redirectTo: 'accounthome', pathMatch: 'prefix' },
            { path: 'accounthome', component: AccountHomeComponent },
            { path: 'datasets', component: DatasetsComponent },
            { path: 'workstation', component: WorkstationComponent },
            { path: 'FAQ', component: FaqComponent },

        ],
    }
];
export const RoutingModule = RouterModule.forRoot(appRoutes);
