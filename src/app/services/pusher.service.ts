import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import Echo from "laravel-echo";
import {SettingsService} from "./setting.service";
import {ClientApi} from "./clientapi.service";


declare var Pusher: any;

@Injectable()
export class PusherService {
    private echo;
    private pusher;
    private publicChannel;
    public messageObserver = new Subject();

    constructor(public settings: SettingsService, public api: ClientApi) {

    }

    connect() {
        this.echo = new Echo({
            broadcaster: 'pusher',
            key: this.settings.PUSHER_APP_KEY,
            cluster: this.settings.PUSHER_APP_CLUSTER,
            authEndpoint: this.settings.serverUrl + "/broadcasting/auth",
            auth: {
                headers: {
                    'Authorization': 'Bearer ' + this.settings.getStorage('token')
                }
            }
        });

        console.log(this.settings.getUserSetting('id'));

        this.echo.private('App.User.' + this.settings.getUserSetting('id'))
            .notification((notification) => {
                // check if notification is new message
                console.log('private');
                if (notification.type.endsWith('NewMessageNotification')) {
                    this.settings.user.new_message_count++;
                } else {
                    this.settings.user.new_alert_count++;
                }
            })

        this.publicChannel = this.echo.join('public');


        ///  message  pusher subscribe
        this.publicChannel.here((users) => {
            //console.log(users);
        }).listen('.message', res => {
            this.messageObserver.next(res.data);
        });
    }

    disconnect() {
        this.echo.leave('public');
        this.echo.leave('App.User.' + this.settings.getUserSetting('id'));
    }

    getEcho() {
        return this.echo;
    }

    getPublicChannel() {
        return this.publicChannel;
    }

    getMessageEvent(): Observable<any> {
        return this.messageObserver;
    }
}