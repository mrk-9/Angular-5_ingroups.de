/**
 * Created by ApolloYr on 2/5/2018.
 */
import { Injectable } from "@angular/core";
import { Api } from "./api.service";

@Injectable()
export class ClientApi extends Api {

    public register(data) {
        return this.post('/user/register', data);
    }

    public login(data) {
        return this.post('/user/login', data);
    }

    public forgotPassword(data) {
        return this.post('/user/forgotPassword', data);
    }

    public resetPassword(data) {
        return this.post('/user/resetPassword', data);
    }

    public getAccountInfo() {
        return this.get('/account/getAccount');
    }

    public getProfiile() {
        return this.get('/account/getProfile');
    }

    public saveProfile(data) {
        return this.post('/account/saveProfile', data);
    }

    public createEvent(data) {
        return this.post('/event/createEvent', data);
    }

    public loadEvent(data) {
        return this.post('/event/loadEvent', data);
    }

    public createContact(data) {
        return this.post('/event/createContact', data);
    }

    public getMyEvents() {
        return this.get('/event/getMyEvents');
    }

    public getContactList() {
        return this.get('/account/getContactList');
    }

    public sendMessage(data) {
        return this.post('/message/sendMessage', data);
    }

    public loadMessage(data) {
        return this.post('/message/loadMessage', data);
    }

    public endEvent(data) {
        return this.post('/event/endEvent', data);
    }

    public readMessage(id) {
        return this.post('/message/readMessage', { contactId: id });
    }

    public getContactListByEvent(id) {
        return this.get('/event/getContactListByEvent', { eventId: id });
    }

    public contact2User(data) {
        return this.post('/event/contact2User', data);
    }

    public resendVerifyEmail(data) {
        return this.post('/user/sendVerifyEmail', data);
    }

    public loadBusinessUsers() {
        return this.get('/user/loadBusinessUsers');
    }
}