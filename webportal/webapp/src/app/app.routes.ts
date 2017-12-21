import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { AboutComponent } from './main/about/about.component';
import { AccountComponent } from './account/account.component';
import { AccountHomeComponent } from './account/accounthome/accounthome.component';
import { SettingsComponent } from './account/settings/settings.component';
import { WorkstationComponent } from './account/workstation/workstation.component';
import { RegisterComponent } from './main/register/register.component';

const appRoutes: Routes = [
    {
        path: '', component: MainComponent, children: [
            { path: '', redirectTo: '/about', pathMatch: 'full' },
            { path: 'index.html', component: HomeComponent },
            { path: 'home', component: HomeComponent },
            { path: 'about', component: AboutComponent },
            { path: 'register', component: RegisterComponent },
        ],
    },
    {
        path: 'account', component: AccountComponent, children: [
            { path: '', redirectTo: 'accounthome', pathMatch: 'prefix' },
            { path: 'accounthome', component: AccountHomeComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'workstation', component: WorkstationComponent },
        ],
    }
];
export const RoutingModule = RouterModule.forRoot(appRoutes);
