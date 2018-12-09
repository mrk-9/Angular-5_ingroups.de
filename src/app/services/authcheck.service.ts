/**
 * Created by ApolloYr on 11/17/2017.
 */
import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { Api } from './api.service';
import { SettingsService } from "./setting.service";
import { ClientApi } from "./clientapi.service";
import { PusherService } from './pusher.service';
import { MessagingService } from "./messaging.service";

@Injectable()
export class AuthCheck implements Resolve<any> {

    constructor(private router: Router,
        public settings: SettingsService,
        private api: ClientApi,
        public pusherService: PusherService,
        private msgService: MessagingService
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.settings.getAppSetting('is_loggedin')) {
                resolve(true);
            } else if (this.settings.getStorage('email') && this.settings.getStorage('password')) {
                this.api.login({
                    email: this.settings.getStorage('email'),
                    password: this.settings.getStorage('password')
                }).subscribe(res => {
                    if (res.success) {
                        this.settings.setAppSetting('is_loggedin', true);
                        this.settings.user = res;

                        this.settings.setStorage('token', res.token);

                        this.pusherService.connect();

                        this.msgService.loadContactList();

                        resolve(true);
                    } else {
                        this.settings.setStorage('email', false);
                        this.settings.setStorage('password', false);
                        this.settings.setStorage('token', false);
                        resolve(true);
                    }
                }, err => {
                    this.settings.setStorage('email', false);
                    this.settings.setStorage('password', false);
                    this.settings.setStorage('token', false);
                    resolve(true);
                });
            } else {
                this.settings.setStorage('email', false);
                this.settings.setStorage('password', false);
                this.settings.setStorage('token', false);
                resolve(true);
            }
        });
    }
}

