import { Component, OnInit } from "@angular/core";
import { SettingsService } from "../../services/setting.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NewEventModalComponent } from "../../shared/modal/new-event-modal/new-event-modal.component";
import { SpecialEvent } from "../../services/specialevent.service";
import { ContactModalComponent } from "../../shared/modal/contact-modal/contact-modal.component";

declare var $: any;
declare const google: any;
@Component({
    selector: 'app-specialevent',
    templateUrl: './specialevent.component.html',
    styleUrls: ['./specialevent.component.scss']
})
export class SpecialeventComponent implements OnInit {

    public createrId = 0;
    public events = [];
    public p = 1;
    public alertMessage: any;
    public getSpecialEventCalled = false;
    public clearFilterCalled = false;

    public filters = {
        categoryFilter: [
            { name: 'Dating', selected: false },
            { name: 'Bildung', selected: false },
            { name: 'Sport & Fitness', selected: false },
            { name: 'Reisen', selected: false },
            { name: 'Feiern', selected: false },
            { name: 'Essen & Trinken', selected: false },
        ],
        cityFilter: [],
        numberFilter: [
            { number: 1, selected: false },
            { number: 2, selected: false },
            { number: 3, selected: false },
            { number: 4, selected: false },
            { number: 5, selected: false },
            { number: 6, selected: false },
            { number: 7, selected: false },
            { number: 8, selected: false },
            { number: 9, selected: false },
            { number: 10, selected: false },
            { number: 11, selected: false },
            { number: 12, selected: false },
            { number: 13, selected: false },
            { number: 14, selected: false },
            { number: 15, selected: false },

        ],
        dateFilter: ''
    };

    constructor(
        public setting: SettingsService,
        public activateRoute: ActivatedRoute,
        private modalService: NgbModal,
        public api: SpecialEvent,
        public router: Router
    ) {
        var s = document.createElement("script");
        s.src = "https://maps.googleapis.com/maps/api/js?key="+this.setting.googleMapApiKey+"&callback";
        s.type = "text/javascript";
        $("head").append(s);
    }

    ngOnInit() {
        $(document).ready(function () {
            setInterval(function () {
                $('#MEGA_BACKGORUND_box .MegaBackgroundBanner:nth-child(1)').fadeOut(4000, function () {
                    $(this).appendTo('#MEGA_BACKGORUND_box');
                });
                $('#MEGA_BACKGORUND_box .MegaBackgroundBanner:nth-child(2)').fadeIn(4000);
            }, 4000);
        });
        this.getLocations();
        this.activateRoute.params.subscribe(params => {
            if (params.createrId) {
                this.createrId = params.createrId;
            }
        });
        if (!!navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition.bind(this), this.errorCallback.bind(this));
        }
    }

    getLocations() {
        this.api.getLocations().subscribe(res => {
            res.data.forEach(item => {
                this.filters.cityFilter.push({"name":item.location,"selected":false});
            });
        }, error => {
            this.filters.cityFilter = [];
        });
    }

    showPosition(position) {

        console.log(position);
        var _this = this;
        var foundCityinCityfilter = false;
        let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': location }, function (results, status) {

            console.log(results);
            if (status == google.maps.GeocoderStatus.OK) {
                for (var i = 0; i < results[0].address_components.length; i++) {
                    var locality = results[0].address_components[i].types[0];

                    if (locality == "administrative_area_level_2") {
                        var resJson = results[0].address_components[i];
                        for (var j = 0; j < _this.filters.cityFilter.length; j++) {
                            if (_this.filters.cityFilter[j].name == resJson.long_name) {
                                foundCityinCityfilter = true;
                                _this.filters.cityFilter[j].selected = true;
                                break;
                            }
                        }
                    }
                }
                if (foundCityinCityfilter) {
                    _this.getSpecialEvent();
                } else {
                    _this.clearFilterCalled = true;
                    _this.clearFilter();
                }
            } else {
                _this.clearFilterCalled = true;
                _this.clearFilter();
            }
        });
    }

    errorCallback(error) {
        var errorMessage = 'Unknown error';
        switch (error.code) {
            case 1:
                errorMessage = 'Permission denied';
                break;
            case 2:
                errorMessage = 'Position unavailable';
                break;
            case 3:
                errorMessage = 'Timeout';
                break;
        }
        console.log("Error Message :" + errorMessage);
        this.getSpecialEvent();
    }

    newEvent() {
        if (this.setting.getAppSetting('is_loggedin')) {
            this.modalService.open(NewEventModalComponent, { backdrop: 'static' });
        } else {
            var r = confirm("You need to login to create new event");

            if (r == true) {
                this.router.navigate(['/login'])
            }
        }
    }

    getSpecialEvent() {
        if (this.createrId != 0 && this.createrId != null) {
            this.api.getSpecialEvent({
                categoryFilter: this.filters.categoryFilter.filter(filter => filter.selected == true),
                cityFilter: this.filters.cityFilter.filter(filter => filter.selected == true),
                dateFilter: this.filters.dateFilter,
                numberFilter: this.filters.numberFilter.filter(filter => filter.selected == true),
                createrId: this.createrId
            }).subscribe(res => {
                if (res.success) {
                    this.events = res.data;
                    this.p = 1;
                    if (this.events.length == 0) {
                        if (!this.clearFilterCalled) {
                            this.clearFilterCalled = true;
                            this.clearFilter();
                        } else {
                            this.getSpecialEventCalled = true;
                        }
                    }
                }
            });
        }
    }

    clearFilter() {
        $('.filterBox.collapse').collapse('hide');

        this.filters.dateFilter = '';

        for (let i = 0; i < this.filters.categoryFilter.length; i++) {
            this.filters.categoryFilter[i]['selected'] = false;
        }

        for (let i = 0; i < this.filters.cityFilter.length; i++) {
            this.filters.cityFilter[i]['selected'] = false;
        }

        for (let i = 0; i < this.filters.numberFilter.length; i++) {
            this.filters.numberFilter[i]['selected'] = false;
        }
        if (this.createrId != 0 && this.createrId != null) {
            this.getSpecialEvent();
        }
    }

    contact(event) {
        if (this.setting.getAppSetting('is_loggedin')) {
            let modalRef = this.modalService.open(ContactModalComponent, { backdrop: 'static' });
            modalRef.componentInstance.event = event;
            modalRef.componentInstance.fromSpecialEvent = true;
        } else {
            var r = confirm("You need to login to contact to new event");

            if (r == true) {
                this.router.navigate(['/login'])
            }
        }
    }

    hideToggle(href) {
        $(".filterBox:not(" + href + ")").collapse('hide');
    }

    filterEvents() {
        $('.filterBox.collapse').collapse('hide');
        this.getSpecialEvent();
    }

    showMoreInfo(id) {
        var bubble = $("#bubble" + id);
        if (bubble.is(":hidden")) {
            bubble.show('slow');
        } else {
            bubble.hide('slow');
        }
    }

    pageChange(page){
        this.p = page;
        window.scrollTo(0, 0);
    }
}
