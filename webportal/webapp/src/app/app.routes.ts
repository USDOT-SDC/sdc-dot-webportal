import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { AboutComponent } from './main/about/about.component';
import { AccountComponent } from './account/account.component';
import { MyAccountComponent } from './account/myaccount/myaccount.component';
import { SettingsComponent } from './account/settings/settings.component';

const appRoutes: Routes = [
    {
        
        path: '', component: MainComponent, children: [
            { path: '', redirectTo: '/home', pathMatch: 'full' },
            { path: 'index.html', component: HomeComponent },
            { path: 'home', component: HomeComponent },
            { path: 'about', component: AboutComponent },
        ],
    },
    {
        path: 'account', component: AccountComponent, children: [
            { path: '', redirectTo: 'myaccount', pathMatch: 'prefix' },
            { path: 'myaccount', component: MyAccountComponent },
            { path: 'settings', component: SettingsComponent },
        ],
    }
];
    
export const RoutingModule = RouterModule.forRoot(appRoutes);