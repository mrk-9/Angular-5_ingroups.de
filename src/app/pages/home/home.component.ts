/**
 * Created by ApolloYr on 2/3/2018.
 */

import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { SettingsService } from "../../services/setting.service";
import { NotifyService } from "../../services/notify.service";
import { EventsService } from "angular4-events";
import { ClientApi } from "../../services/clientapi.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NewEventModalComponent } from "../../shared/modal/new-event-modal/new-event-modal.component";
import { ContactModalComponent } from "../../shared/modal/contact-modal/contact-modal.component";
import { Subject } from "rxjs";
import { PusherService } from "../../services/pusher.service";
import { takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { SpecialEvent } from "../../services/specialevent.service";

declare var $: any;
@Component({
    selector: 'page-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
    page: string;

    public events = [];
    public p = 1;
    public user;

    public businessUsers = [];

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
    }

    private ngUnsubscribe = new Subject();

    constructor(
        public dialog: MatDialog,
        public setting: SettingsService,
        public notify: NotifyService,
        public event: EventsService,
        public api: ClientApi,
        public specialEvent: SpecialEvent,
        private modalService: NgbModal,
        public pusher: PusherService,
        public router: Router
    ) {
        this.page = 'videochat';
    }

    ngOnInit() {
        //this.clearFilter();

        $(document).ready(function () {
            setInterval(function () {
                $('#MEGA_BACKGORUND_box .MegaBackgroundBanner:nth-child(1)').fadeOut(4000, function () {
                    $(this).appendTo('#MEGA_BACKGORUND_box');
                });
                $('#MEGA_BACKGORUND_box .MegaBackgroundBanner:nth-child(2)').fadeIn(4000);
            }, 4000);


        })
        this.userDetails();
        this.loadEvent();
        this.loadBusinessUsers();
        this.getLocations();
    }

    ngOnDestroy() {

    }

    ngAfterViewInit() {

    }

    loadBusinessUsers() {
        this.api.loadBusinessUsers().subscribe(res => {
            if (res.success) {
                this.businessUsers = res.data;
            }
        })
    }

    getLocations() {
        this.specialEvent.getLocations().subscribe(res => {
            res.data.forEach(item => {
                this.filters.cityFilter.push({"name":item.location,"selected":false});
            });
        }, error => {
            this.filters.cityFilter = [];
        });
    }

    newEvent() {
        if (this.setting.getAppSetting('is_loggedin')) {
            let modalRef = this.modalService.open(NewEventModalComponent, { backdrop: 'static' });
            modalRef.componentInstance.user = this.user;
            modalRef.result.then((data) => {
                if (data && data.created) {
                    this.loadEvent();
                }
            }, (reason) => {

            });
        } else {
            var r = confirm("Sie müssen sich einloggen um ein Event zu erstellen");

            if (r == true) {
                this.router.navigate(['/login'])
            }
        }
    }

    contact(event) {
        if (this.setting.getAppSetting('is_loggedin')) {
            let modalRef = this.modalService.open(ContactModalComponent, { backdrop: 'static' });
            modalRef.componentInstance.event = event;
            modalRef.componentInstance.fromSpecialEvent = false;
        } else {
            var r = confirm("Sie müssen sich einloggen um Event-Details zu sehen");

            if (r == true) {
                this.router.navigate(['/login'])
            }
        }
    }


    loadEvent() {

        this.api.loadEvent({
            categoryFilter: this.filters.categoryFilter.filter(filter => filter.selected == true),
            cityFilter: this.filters.cityFilter.filter(filter => filter.selected == true),
            dateFilter: this.filters.dateFilter,
            numberFilter: this.filters.numberFilter.filter(filter => filter.selected == true)
        }).subscribe(res => {
            if (res.success) {
                this.events = res.data;

                console.log(this.events);

                this.p = 1;
            }
        })

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

        this.loadEvent();
    }

    hideToggle(href) {
        $(".filterBox:not(" + href + ")").collapse('hide');
    }

    filterEvents() {
        $('.filterBox.collapse').collapse('hide');

        this.loadEvent();
    }

    showMoreInfo(id) {
        var bubble = $("#bubble" + id);
        if (bubble.is(":hidden")) {
            bubble.show('slow');
        } else {
            bubble.hide('slow');
        }
    }

    userDetails() {
        if (this.setting.getAppSetting('is_loggedin')) {
            this.api.getProfiile().subscribe(res => {
                if (res.success) {
                    this.user = res.data;
                }
            });
        }
    }

    gotoMoreEventPage(id) {
        //this.router.navigate(['/specialevent/' + id])
        window.open('specialevent/' + id);
    }

    pageChange(page){
        this.p = page;
        window.scrollTo(0, 0);
    }
}
