/**
 * Created by ApolloYr on 4/23/2018.
 */
import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ClientApi } from "../../../services/clientapi.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Validate } from "../../../services/validate.service";
import { SettingsService } from "../../../services/setting.service";
import { NotifyService } from "../../../services/notify.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CounterComponent } from "../counter/counter.component";
import { PositionModalComponent } from "../position/position.component";
import { SpecialEvent } from "../../../services/specialevent.service";

declare var $: any;
@Component({
    selector: 'new-event-modal',
    templateUrl: './new-event-modal.component.html',
    styleUrls: ['./new-event-modal.component.scss']
})
export class NewEventModalComponent implements OnInit {
    @Input() user;

    public businessUser;

    public loading = false;
    public locations = [];
    public localities = [];
    selectedLocations = [];
    selectedLocalities = [];
    public created = false;
    public dropdownSettings = {};
    public localityDropdownSettings = {};

    info = {
        title: '',
        date: '',
        phonenumber: '',
        location: [],
        category: '',
        number: '',
        description: '',
        image: '',
        position: '',
        contact_email: '',
        locality: []
    }

    form: FormGroup;

    public confirm = false;

    constructor(
        public activeModal: NgbActiveModal,
        public api: ClientApi,
        public formBuilder: FormBuilder,
        public validate: Validate,
        public notify: NotifyService,
        public setting: SettingsService,
        private modalService: NgbModal,
        public specialApi: SpecialEvent
    ) {

    }

    ngOnInit() {
        this.businessUser = this.user.businessUser;
        if (this.businessUser) {
            this.dropdownSettings = {
                singleSelection: false,
                idField: 'id',
                textField: 'location',
                selectAllText: 'Select All',
                unSelectAllText: 'UnSelect All',
                itemsShowLimit: 1,
                allowSearchFilter: true,
                idProperty: 'id'
            };
        } else {
            this.dropdownSettings = {
                singleSelection: true,
                idField: 'id',
                textField: 'location',
                itemsShowLimit: 1,
                allowSearchFilter: true,
                idProperty: 'id'
            };
        }
        this.localityDropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'locality',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 1,
            allowSearchFilter: true,
            idProperty: 'id'
        };
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            date: ['', Validators.required],
            time: ['', Validators.required],
            location: [[], Validators.required],
            category: ['', Validators.required],
            number: ['', Validators.required],
            description: ['', Validators.required],
            position: [''],
            contact_email: [''],
            locality: [[]]
        });
        this.fetchLocalities();
        this.specialApi.getLocations().subscribe(res => {
            this.locations = res.data;
            if (this.businessUser && this.user.location_id.length > 0) {
                this.user.location_id.forEach(item => {
                    res.data.forEach(loca => {
                        if (item == loca.id) {
                            this.info.location.push(loca);
                        }
                    });
                });

                this.selectedLocations = this.info.location;

                this.specialApi.getLocalityById({ "id": this.user.location_locality_id }).subscribe(response => {
                    this.user.location_locality_id.forEach(item => {
                        response.data.forEach(loc => {
                            if (item == loc.id) {
                                this.info.locality.push(loc);
                            }
                        });
                    });
                    this.selectedLocalities = this.info.locality;
                });
            }
        }, error => {
            this.locations = [];
        });
    }

    ngAfterViewInit() {
        $(".multiselect-dropdown .dropdown-btn").css({
            "border": "1px solid #ced4da",
            "padding": "0.4rem 0.75rem",
            "border-radius": "0px 4px 4px 0px",
            "height": "38px"
        });
    }

    fetchLocalities() {
        this.specialApi.getAllLocality().subscribe(response => {
            this.localities = response.data;
        }, error => {
            this.localities = [];
        });
    }

    createEvent() {
        this.info.location = this.selectedLocations;
        this.info.locality = this.selectedLocalities;
        console.log(JSON.stringify(this.info));

        if (this.form.valid) {
            if (this.info.image == '') {
                alert('Bitte alle Felder ausfüllen!');
                return;
            }

            this.loading = true;

            var date = new Date(this.form.value.time);
            var time = date.toLocaleTimeString('en-US', { hour12: false });
            console.log(time);

            this.api.createEvent({
                ...this.info,
                time: time
            }).subscribe(res => {

                this.loading = false;

                if (res.success) {

                    this.created = true;

                    console.log('close');
                    this.activeModal.close({
                        created: this.created
                    });

                    this.notify.showNotification('success', 'Erfolgreich gesendet!');
                }
            }, error => {
                this.loading = false;
            });
        } else {
            this.validate.validateAllFormFields(this.form);
        }

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

                $('#newEventUploadImageName').val(file.name);
            }
        })


    }

    close() {
        console.log('close');
        this.activeModal.close({
            created: this.created
        })
    }

    setCounter(number) {
        let modalRef = this.modalService.open(CounterComponent, { size: 'lg' });
        modalRef.componentInstance.number = number;
        modalRef.result.then((data) => {
            this.info.number = data.counterValue;
        }, (reason) => {
        });
    }

    setPosition() {
        let modalRef = this.modalService.open(PositionModalComponent, { size: 'lg' });
        modalRef.result.then((data) => {
            if (data && data.positionValue) {
                this.info.position = data.positionValue;
            }
        }, (reason) => {
        });
    }

    addLocationIdtoList() {
        var newLocalities = [];
        this.localities.forEach(loc => {
            this.selectedLocalities.forEach(item => {
                if (item.id == loc.id) {
                    newLocalities.push(loc);
                }
            });
        });
        this.selectedLocalities = newLocalities;
    }
}