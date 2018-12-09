import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SettingsService } from "./services/setting.service";
import { ClientApi } from "./services/clientapi.service";
import { PusherService } from "./services/pusher.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

declare var $: any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'app';

    private ngUnsubscribe = new Subject();

    constructor(
        public setting: SettingsService,
        public api: ClientApi,
        public pusher: PusherService
    ) {

    }

    ngOnInit() {
        // $(document).ready(function () {
        //     //alert('read');//
        //     $(window).on("beforeunload", function (event) {
        //         event.preventDefault();
        //         return '';
        //     })
        // })
    }

    checkCookieBar() {
        this.setting.setStorage('checkCookieBar', true);
    }

    ngAfterViewInit() {
        this.pusher.getMessageEvent().pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(data => {
                this.onMessageEvent(data);
            });
    }

    onMessageEvent(data) {

    }
}
