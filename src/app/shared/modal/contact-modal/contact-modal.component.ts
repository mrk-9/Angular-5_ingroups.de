/**
 * Created by ApolloYr on 4/25/2018.
 */
import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClientApi } from "../../../services/clientapi.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Validate } from "../../../services/validate.service";
import { SettingsService } from "../../../services/setting.service";
import { NotifyService } from "../../../services/notify.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { Contact2UserFormComponent } from "../contact2user-form/contact2user-form.component";

declare var $: any;
@Component({
    selector: 'contact-modal',
    templateUrl: './contact-modal.component.html',
    styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent implements OnInit {

    @Input() event;
    @Input() fromSpecialEvent;

    public loading = false;

    form: FormGroup;
    info = {
        eventId: '',
        image: '',
        message: '',
        selectedLocation: '',
        event_location_id: ''
    }
    public locations = [];
    public upperlimits = [];
    public upperlimit = -1;
    public contact_counts = [];
    public contact_count = 0;
    public event_location_ids = [];

    public contactList = [];
    public locationContactList = [];
    public showContactList = false;

    public confirm = false;

    constructor(
        public activeModal: NgbActiveModal,
        public api: ClientApi,
        public formBuilder: FormBuilder,
        public validate: Validate,
        public notify: NotifyService,
        public setting: SettingsService,
        private modalService: NgbModal,
        public router: Router,
        public modal: MatDialog,
    ) {

    }

    ngOnInit() {
        console.log(this.event);
        if (this.event.specialEvent) {
            this.locations = this.event.Ort.split(',');
            this.upperlimits = this.event.event_location_upperlimit.split(',');
            this.event_location_ids = this.event.event_location_id.split(',');
            this.contact_counts = this.event.event_location_contact_count.split(',');
            this.info.selectedLocation = this.locations[0];
            this.upperlimit = this.upperlimits[0];
            this.contact_count = this.contact_counts[0];
            this.info.event_location_id = this.event_location_ids[0];
        } else {
            this.info.selectedLocation = this.event.Ort;
            this.upperlimit = this.event.event_location_upperlimit;
            this.contact_count = this.event.event_location_contact_count;
            this.info.event_location_id = this.event.event_location_id;
        }
        this.info.eventId = this.event.id;

        console.log(this.info.eventId);

        this.getContactList(this.event.id);

        this.form = this.formBuilder.group({
            message: ['', Validators.required],
        })
        this.info.image = this.setting.getUserSetting('photo');

    }

    fileChangeListener($event) {
        let file: File = $event.target.files[0];

        if (typeof file == 'undefined') return;

        var fileType = file["type"];
        var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];

        if ($.inArray(fileType, ValidImageTypes) < 0) {
            alert('you must upload image file: *.gif, *.jpg, *.png');
            return;
        }

        this.api.uploadImage(file).subscribe(res => {
            if (res.success) {
                this.info.image = this.setting.serverUrl + res.url;
                console.log(this.info.image);

                $('#eventContactUploadImageName').val(file.name);
            }
        })
    }

    createContact() {
        if (this.form.valid) {

            // if (this.info.image == '') {
            //     alert('Bitte alle Felder ausfüllen!');
            //     return;
            // }

            this.loading = true;
            this.api.createContact({
                ...this.info,
                "createrImage": this.event.image
            }).subscribe(res => {

                this.loading = false;

                if (res.success) {
                    this.notify.showNotification('success', 'Erfolgreich gesendet!');
                    this.activeModal.dismiss();
                } else {
                    this.notify.showNotification('warning', res.error);
                    this.activeModal.dismiss();
                }
            }, error => {
                this.loading = false;
            });
        } else {
            this.validate.validateAllFormFields(this.form);
        }
    }

    contact2User(item) {
        console.log(item);

        // if (this.setting.getAppSetting('is_loggedin')) {
        //     let modalRef = this.modalService.open(Contact2UserModalComponent, { backdrop: 'static' });
        //     modalRef.componentInstance.event = event;
        // } else {
        //     var r = confirm("You need to login to contact to this user");

        //     if (r == true) {
        //         this.router.navigate(['/login'])
        //     }
        // }

        // let modalRef = this.modal.open(Contact2UserFormComponent, {
        //     width: '450px',
        //     data: {
        //         'contactInfo': item
        //     }
        // })
    }

    getContactList(id) {
        this.api.getContactListByEvent(id).subscribe(res => {
            if (res.success) {
                console.log(res.data);
                this.contactList = res.data;
                if (this.locations.length > 1) {
                    for (let j = 0; j < this.contactList.length; j++) {
                        if (this.locations[0] == this.contactList[j].location) {
                            this.locationContactList.push(this.contactList[j]);
                        }
                    }
                }
                else {
                    this.locationContactList = this.contactList;
                }
                this.getAges();
            }
        })
    }

    getAges() {
        for (let i = 0; i < this.contactList.length; i++) {
            let birthday = this.contactList[i].birthday;

            let dob = new Date(birthday);
            var diff_ms = Date.now() - dob.getTime();
            var age_dt = new Date(diff_ms);

            var age = Math.abs(age_dt.getUTCFullYear() - 1970);
            console.log(age);

            this.contactList[i]['age'] = age;
        }
    }

    toggleContactForm(item) {
        if (item.contacterId == this.setting.getUserSetting('id')) return;
        console.log(item.showContactForm);
        if (typeof item.showContactForm == 'undefined') {
            item.showContactForm = true
        } else {
            item.showContactForm = !item.showContactForm;
        }
        if (item.showContactForm) {
            let modalRef = this.modalService.open(Contact2UserFormComponent, { size: 'lg' });
            modalRef.componentInstance.item = item;
        }
    }

    getSpecialEvent(createrId) {
        this.activeModal.dismiss();
        this.router.navigate(['/specialevent/' + createrId]);
    }

    locationChanged(selectedLocation) {
        this.locationContactList = [];
        for (let i = 0; i < this.locations.length; i++) {
            if (this.locations[i] == selectedLocation) {
                this.upperlimit = this.upperlimits[i];
                this.contact_count = this.contact_counts[i];
                this.info.event_location_id = this.event_location_ids[i];
                for (let j = 0; j < this.contactList.length; j++) {
                    if (this.locations[i] == this.contactList[j].location) {
                        this.locationContactList.push(this.contactList[j]);
                    }
                }
                break;
            }
        }
    }
}