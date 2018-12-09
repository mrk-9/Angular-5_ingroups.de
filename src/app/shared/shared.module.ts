/**
 * Created by ApolloYr on 2/5/2018.
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "./material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NewEventModalComponent } from "./modal/new-event-modal/new-event-modal.component";
import { ContactModalComponent } from "./modal/contact-modal/contact-modal.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { RouterModule } from "@angular/router";
import { ForgotPasswordModalComponent } from "./modal/forgot-password-modal/forgot-password-modal.component";
import { CalendarModule } from 'primeng/calendar';
import { GalleryModalComponent } from './modal/gallery/gallery.component';
import { Contact2UserFormComponent } from './modal/contact2user-form/contact2user-form.component';
import { WhatsappModalComponent } from "./modal/whatsapp/whatsapp.component";
import { CounterComponent } from "./modal/counter/counter.component";
import { VerifyModalComponent } from './modal/verify-modal/verify-modal.component';
import { PositionModalComponent } from "./modal/position/position.component";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    imports: [
        FlexLayoutModule,
        BrowserModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        RouterModule,
        CalendarModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    entryComponents: [
        NewEventModalComponent,
        ContactModalComponent,
        ForgotPasswordModalComponent,
        FooterComponent,
        HeaderComponent,
        GalleryModalComponent,
        Contact2UserFormComponent,
        WhatsappModalComponent,
        CounterComponent,
        VerifyModalComponent,
        PositionModalComponent
    ],
    declarations: [
        NewEventModalComponent,
        ContactModalComponent,
        ForgotPasswordModalComponent,
        FooterComponent,
        HeaderComponent,
        GalleryModalComponent,
        Contact2UserFormComponent,
        WhatsappModalComponent,
        CounterComponent,
        VerifyModalComponent,
        PositionModalComponent
    ],
    exports: [
        NewEventModalComponent,
        ContactModalComponent,
        ForgotPasswordModalComponent,
        FooterComponent,
        HeaderComponent,
        GalleryModalComponent,
        Contact2UserFormComponent,
        WhatsappModalComponent,
        CounterComponent,
        VerifyModalComponent,
        PositionModalComponent
    ],
    providers: [],
})
export class SharedModule {

}