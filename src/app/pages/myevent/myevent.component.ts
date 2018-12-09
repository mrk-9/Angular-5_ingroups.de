/**
 * Created by ApolloYr on 4/27/2018.
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ClientApi} from "../../services/clientapi.service";
import {NotifyService} from "../../services/notify.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NewEventModalComponent} from "../../shared/modal/new-event-modal/new-event-modal.component";
import {WhatsappModalComponent } from "../../shared/modal/whatsapp/whatsapp.component";
import {CounterComponent } from "../../shared/modal/counter/counter.component";

declare var $: any;
@Component({
    selector: 'page-myevent',
    templateUrl: './myevent.component.html',
    styleUrls: ['./myevent.component.scss']
})
export class MyEventComponent implements OnInit{

    public events = [];
    public p = 1;
    constructor(
        public api: ClientApi,
        public notify: NotifyService,
        private modalService: NgbModal,
    ) {

    }

    ngOnInit() {
        this.getMyEvents();
    }

    public getMyEvents() {
        this.api.getMyEvents().subscribe(res => {
            if (res.success) {
                this.events = res.data;
            }
        })
    }

    showMoreInfo(id) {
        var bubble = $("#bubble" + id);
        if (bubble.is(":hidden")) {
            bubble.show('slow');
        } else {
            bubble.hide('slow');
        }
    }

    endEvent(event) {
        var r = confirm("Würde Sie mögen zu ende dies Veranstaltung?");

        if (r == true) {
            this.api.endEvent({
                id: event.event_location_id
            }).subscribe(res => {
                if (res.success) {
                    event.event_location_end = 1;
                }
            })            
        }
    }

    newEvent() {
        this.modalService.open(NewEventModalComponent, {backdrop: 'static'})
            .result.then(result => {
                this.getMyEvents();
            }, reason => {
                this.getMyEvents();
            });

    }

    showWhatsappInfo(event) {
        let modalRef = this.modalService.open(WhatsappModalComponent, { size: 'lg' });
        modalRef.componentInstance.event = event;
        modalRef.result.then(result => {
            this.getMyEvents();
        }, reason => {
            this.getMyEvents();
        });
    }

    showCounterInfo(event) {
        let modalRef = this.modalService.open(CounterComponent, { size: 'lg' });
        modalRef.componentInstance.event = event;
        modalRef.result.then(result => {
            this.getMyEvents();
        }, reason => {
            this.getMyEvents();
        });
    }

    pageChange(page){
        this.p = page;
        window.scrollTo(0, 0);
    }
}