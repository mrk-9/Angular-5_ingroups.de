/**
 * Created by ApolloYr on 4/22/2018.
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from "../shared/shared.module";
import 'hammerjs';
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "../shared/material.module";
import { HomeComponent } from "./home/home.component";
import { DatenschutzComponent } from "./datenschutz/datenschutz.component";
import { AGBsComponent } from "./agbs/agbs.component";
import { ImpressumComponent } from "./impressum/impressum.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxPaginationModule } from "ngx-pagination";
import { MyEventComponent } from "./myevent/myevent.component";
import { RouterModule } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";
import { MessagesComponent } from "./messages/messages.component";
import { InfoComponent } from './info/info.component';
import { SpecialeventComponent } from './specialevent/specialevent.component';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';

@NgModule({
    imports: [
        FlexLayoutModule,
        BrowserModule,
        SharedModule,
        FormsModule,
        MaterialModule,
        NgxPaginationModule,
        NgbModule,
        RouterModule,
        AngularDateTimePickerModule
    ],
    entryComponents: [

    ],
    declarations: [
        HomeComponent,
        DatenschutzComponent,
        AGBsComponent,
        ImpressumComponent,
        MyEventComponent,
        ProfileComponent,
        MessagesComponent,
        InfoComponent,
        SpecialeventComponent
    ],
    exports: [
        HomeComponent,
        DatenschutzComponent,
        AGBsComponent,
        ImpressumComponent,
        MyEventComponent,
        ProfileComponent,
        MessagesComponent,
        InfoComponent,
        SpecialeventComponent
    ],
    providers: [],
})
export class PagesModule {

}
