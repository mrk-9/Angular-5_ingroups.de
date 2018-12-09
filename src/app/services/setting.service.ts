/**
 * Created by ApolloYr on 1/28/2018.
 */
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class SettingsService {

    public PUSHER_APP_KEY = environment.PUSHER_APP_KEY;
    public PUSHER_APP_CLUSTER = environment.PUSHER_APP_CLUSTER;

    public serverUrl = environment.serverUrl;
    public apiUrl = environment.apiUrl;
    public googleMapApiKey = environment.googleMapApiKey;

    public user: any;
    public app: any;
    public sys: any;
    public isLoggedIn = false;

    public loading = false;

    public showMode = {
        footer: true,
    }


    private storagePrefix = 'ingroups_';

    constructor() {
        // User settings
        this.user = {};

        // App Settings
        this.app = {
            name: 'ingroups'
        };
    }

    init() {

    }

    getUserSetting(name) {
        return name ? this.user[name] : this.user;
    }

    setUserSetting(name, value) {
        this.user[name] = value;
    }

    getAppSetting(name) {
        return name ? this.app[name] : this.app;
    }

    setAppSetting(name, value) {
        this.app[name] = value;
    }

    getSysSetting(name) {
        return name ? this.sys[name] : this.sys;
    }

    setSysSetting(name, value) {
        this.sys[name] = value;
    }

    clearUserSetting() {
        this.setStorage('user', false);
    }

    getStorage (key, defaultVal?) {
        return window.localStorage[this.storagePrefix + key] ? JSON.parse(window.localStorage[this.storagePrefix + key]) : defaultVal || false;
    }

    setStorage (key, val) {
        window.localStorage.setItem(this.storagePrefix + key, JSON.stringify(val));
    }
}
