/**
 * Created by ApolloYr on 1/29/2018.
 */
import { Injectable } from "@angular/core";
import { SettingsService } from "./setting.service";
import { ClientApi } from "./clientapi.service";
import { PusherService } from "./pusher.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Injectable()
export class MessagingService {

    public isMessagePage = false;

    public contactList = [];
    public loaded = false;

    public selectedContactId = -1;
    public selectedItem;

    public mode = 'desktop';

    public noContact = false;

    private ngUnsubscribe = new Subject();

    public isNewMessage = false;

    constructor(
        public setting: SettingsService,
        public api: ClientApi,
        public pusher: PusherService
    ) {
        this.detectDevice();

        this.pusher.getMessageEvent().pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(data => {
                this.onMessageEvent(data);
            });
    }

    onMessageEvent(data) {
        console.log(data);

        if (data.to == this.setting.getUserSetting('id')) {

            if (this.selectedContactId == data.contactId && this.isMessagePage) {
                this.readMessage(data.contactId);
            } else {
                let events = (this.contactList.filter(contacts => contacts.eventId == data.eventId));
                if (events.length > 0) {
                    let items = events[0]['items'].filter(item => item.id == data.contactId);

                    if (items.length > 0) {
                        items[0].unread++;
                    }
                }

                this.verifyNewMessage();   /// verify if there is new message;

            }
        }
    }

    readMessage(contactId) {
        console.log(contactId);

        this.api.readMessage(contactId).subscribe(res => {
            if (res.success) {
                let contacts = this.contactList.filter(contact => contact.id == contactId);
                if (contacts.length > 0) {
                    contacts[0].unread = 0;
                }

                this.verifyNewMessage();   /// verify if there is new message;
            }
        })
    }

    loadContactList() {
        this.loaded = false;
        this.api.getContactList().subscribe(res => {
            if (res.success) {

                this.contactList = this.sortContacts(res.data);

                if (this.contactList.length == 0) {
                    this.noContact = true;
                }

                this.loaded = true;
                console.log(this.contactList);

                this.verifyNewMessage();   /// verify if there is new message;
            }
        })
    }

    sortContacts(contacts) {

        var result = [];
        for (let i = 0; i < contacts.length; i++) {
            let bool = false;
            for (let j = 0; j < result.length; j++) {
                if (result[j]['eventId'] == contacts[i]['eventId']) {
                    result[j]['items'].push(contacts[i]);
                    bool = true;
                    break;
                }
            }

            if (!bool) {
                result.push({
                    eventId: contacts[i]['eventId'],
                    eventName: contacts[i]['eventName'],
                    specialEvent: contacts[i]['specialEvent'],
                    items: [contacts[i]]
                });
            }
        }

        if (this.mode == 'desktop') {
            if (this.selectedContactId == -1 && result.length > 0) {
                this.selectedContactId = result[0]['items'][0]['id'];
            }

            if (this.selectedContactId != -1) {
                let filters = contacts.filter(contact => contact.id == this.selectedContactId);
                if (filters.length > 0) this.selectedItem = filters[0];
            }
        } else {
            if (this.selectedContactId != -1) {
                let filters = contacts.filter(contact => contact.id == this.selectedContactId);
                if (filters.length > 0) this.selectedItem = filters[0];
            }
        }

        return result;
    }

    detectDevice() {
        if (window.innerWidth <= 800 && window.innerHeight <= 1200) {
            this.mode = 'mobile';
            console.log('mobile');
        } else {
            this.mode = 'desktop';
            console.log('desktop');
        }
    }

    public verifyNewMessage() {
        this.isNewMessage = false;
        this.contactList.forEach(event => {
            event.items.forEach(item => {
                if (item.unread > 0) {
                    this.isNewMessage = true;
                    return;
                }
            })
        })
    }
}
