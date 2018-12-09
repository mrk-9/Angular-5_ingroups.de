import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {AppRoutes} from "./app.routing";
import {RouterModule} from "@angular/router";
import {LayoutComponent} from "./layout/layout.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {SharedModule} from "./shared/shared.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ServicesModule} from "./services/services.module";
import {HttpClientModule} from "@angular/common/http";
import {GrowlModule} from "primeng/growl";
import {EventsModule} from "angular4-events";
import {PagesModule} from "./pages/pages.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MaterialModule} from "./shared/material.module";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ResetPasswordComponent} from "./resetpassword/resetpassword.component";
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent,
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        RouterModule.forRoot(AppRoutes),
        NgbModule.forRoot(),
        HttpClientModule,
        FlexLayoutModule,
        PagesModule,
        SharedModule,
        ServicesModule,
        GrowlModule,
        EventsModule.forRoot(),
        AngularDateTimePickerModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
