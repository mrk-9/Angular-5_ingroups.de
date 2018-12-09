import { Routes } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { DatenschutzComponent } from "./pages/datenschutz/datenschutz.component";
import { AGBsComponent } from "./pages/agbs/agbs.component";
import { ImpressumComponent } from "./pages/impressum/impressum.component";
import { LayoutComponent } from "./layout/layout.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { MyEventComponent } from "./pages/myevent/myevent.component";
import { AuthGuard } from "./services/authguard.service";
import { AuthCheck } from "./services/authcheck.service";
import { ProfileComponent } from "./pages/profile/profile.component";
import { MessagesComponent } from "./pages/messages/messages.component";
import { ResetPasswordComponent } from "./resetpassword/resetpassword.component";
import { InfoComponent } from './pages/info/info.component';
import { SpecialeventComponent } from './pages/specialevent/specialevent.component';

export const AppRoutes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                resolve: {
                    user: AuthCheck
                }
            },
            {
                path: 'myevents',
                component: MyEventComponent,
                resolve: {
                    user: AuthGuard
                }
            },
            {
                path: 'messages/:id',
                component: MessagesComponent,
                resolve: {
                    user: AuthGuard
                }
            },
            {
                path: 'messages',
                component: MessagesComponent,
                resolve: {
                    user: AuthGuard
                }
            },
            {
                path: 'profile',
                component: ProfileComponent,
                resolve: {
                    user: AuthGuard
                }
            },
            {
                path: 'datenschutz',
                component: DatenschutzComponent,
                resolve: {
                    user: AuthCheck
                }
            },
            {
                path: 'agb',
                component: AGBsComponent,
                resolve: {
                    user: AuthCheck
                }
            },
            {
                path: 'impressum',
                component: ImpressumComponent,
                resolve: {
                    user: AuthCheck
                }
            },
            {
                path: 'info',
                component: InfoComponent,
                resolve: {
                    user: AuthCheck
                }
            },
            {
                path: 'specialevent/:createrId',
                component: SpecialeventComponent,
                resolve: {
                    user: AuthCheck
                }
            },
        ]
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'register', component: RegisterComponent
    },
    {
        path: 'resetPassword/:confirmcode', component: ResetPasswordComponent
    },
    // {
    //     path: '',
    //     redirectTo: 'home',
    //     pathMatch: 'full'
    // },
    // {
    //     path: 'home',
    //     component: HomeComponent
    // },
    //
    { path: '**', redirectTo: '', }
];
