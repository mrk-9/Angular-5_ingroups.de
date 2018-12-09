/**
 * Created by ApolloYr on 5/8/2018.
 */
import { Component, OnDestroy, OnInit } from "@angular/core";
import { SettingsService } from "../../services/setting.service";
import { ClientApi } from "../../services/clientapi.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PusherService } from "../../services/pusher.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MessagingService } from "../../services/messaging.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { GalleryModalComponent } from "../../shared/modal/gallery/gallery.component";

declare var $: any;
@Component({
    selector: 'page-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

    private sub: any;
    private ngUnsubscribe = new Subject();


    private message = '';
    private messages = [];

    public timer: any;


    public loadingMessage = false;

    constructor(public setting: SettingsService,
        public api: ClientApi,
        public activateRoute: ActivatedRoute,
        public router: Router,
        public pusher: PusherService,
        public msgService: MessagingService,
        private modalService: NgbModal,
    ) {

    }

    ngOnInit() {

        this.msgService.isMessagePage = true;

        this.setting.showMode.footer = false;

        this.sub = this.activateRoute.params.subscribe(params => {
            if (params.id) {
                this.msgService.selectedContactId = params.id;
                console.log('yes');
            } else {
                console.log('no');
            }
            this.loadMessage();
            this.msgService.loadContactList();
        })
    }

    ngAfterViewInit() {
        this.pusher.getMessageEvent().pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(data => {
                this.onMessageEvent(data);
            });
    }

    ngOnDestroy() {

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

        this.sub.unsubscribe();
        this.setting.showMode.footer = true;

        this.msgService.isMessagePage = false;
    }

    onMessageEvent(data) {
        console.log(data);

        if (data.to == this.setting.getUserSetting('id')) {

            if (this.msgService.selectedContactId == data.contactId) {
                this.messages.push(data);
                this.scrollDown();
            }
        }
    }

    selectPartner(item) {
        this.msgService.selectedItem = item;
        this.msgService.selectedContactId = item.id;
        this.router.navigate(['/messages/' + item.id]);
    }

    loadMessage() {
        if (this.msgService.selectedContactId == -1) {
            setTimeout(() => {
                this.loadMessage();
            }, 100);
        }
        else {
            this.loadingMessage = true;
            this.api.loadMessage({
                contactId: this.msgService.selectedContactId
            }).subscribe(res => {
                this.loadingMessage = false;
                if (res.success) {
                    this.messages = res.data;
                    for (let i = 0; i < this.messages.length; i++) {
                        if (this.messages[i].read == 0) {
                            this.readMessageByClick();
                        }
                    }
                    this.scrollDown();
                }
            });
        }
    }

    sendMessage() {
        if (this.message == '') return;

        this.api.sendMessage({
            contactId: this.msgService.selectedContactId,
            eventId: this.msgService.selectedItem.eventId,
            to: this.msgService.selectedItem.partnerId,
            message: this.message
        }).subscribe(res => {
            if (res.success) {
                this.messages.push(res.data);

                this.scrollDown();
            }
        });

        this.message = '';
    }

    sendMessageByEnter($event) {
        if ($event.keyCode == '13') {
            this.sendMessage();
        }
    }

    readMessageByClick() {
        console.log('click');
        if (this.msgService.selectedItem && this.msgService.selectedItem.unread > 0) {
            this.msgService.readMessage(this.msgService.selectedItem.id);
            this.msgService.selectedItem.unread = 0;
        }
    }

    scrollDown() {
        setTimeout(() => {
            $('#message-content').stop().animate({
                'scrollTop': $('#message-content > div').height() + 100
            }, 0, 'swing', function () {

            });
        }, 10);
    }


    back() {
        this.msgService.selectedContactId = -1;
        this.loadMessage();
        this.msgService.loadContactList();
    }

    showGallery(item) {
        let modalRef = this.modalService.open(GalleryModalComponent, { size: 'lg' });
        modalRef.componentInstance.item = item;
    }

}