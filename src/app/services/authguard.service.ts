/**
 * Created by ApolloYr on 1/28/2018.
 */
import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { SettingsService } from './setting.service';
import { Api } from './api.service';
import { ClientApi } from "./clientapi.service";
import { PusherService } from "./pusher.service";
import { MessagingService } from "./messaging.service";

@Injectable()
export class AuthGuard implements Resolve<any> {

    constructor(private router: Router,
        private settings: SettingsService,
        private api: ClientApi,
        private pusherService: PusherService,
        private msgService: MessagingService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.settings.getAppSetting('is_loggedin')) {
                console.log('isLoggedIn');
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
                        reject('information is invalid');
                        this.settings.setStorage('email', false);
                        this.settings.setStorage('password', false);
                        this.settings.setStorage('token', false);
                        this.settings.setAppSetting('is_loggedin', false);
                        this.router.navigate(['/']);
                    }
                }, err => {
                    reject('information is invalid');
                    this.settings.setStorage('email', false);
                    this.settings.setStorage('password', false);
                    this.settings.setStorage('token', false);
                    this.settings.setAppSetting('is_loggedin', false);
                    this.router.navigate(['/']);
                });
            } else {
                reject('not logged in');
                this.settings.setStorage('email', false);
                this.settings.setStorage('password', false);
                this.settings.setStorage('token', false);
                this.settings.setAppSetting('is_loggedin', false);
                this.router.navigate(['/']);
            }
        });
    }

}
