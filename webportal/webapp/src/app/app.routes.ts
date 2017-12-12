import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { LoginComponent } from './main/login/login.component';
import { AboutComponent } from './main/about/about.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { AccountComponent } from './user-home/account/account.component';
import { SettingsComponent } from './user-home/settings/settings.component';

const appRoutes: Routes = [
    {
        path: '', component: MainComponent, children: [
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: 'about', component: AboutComponent }
        ],
    },
    { path: 'home', component: UserHomeComponent, children: [
        { path: '', component: AccountComponent },
        { path: 'settings', component: SettingsComponent }
    ] }
];
    
export const RoutingModule = RouterModule.forRoot(appRoutes);