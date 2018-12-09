/**
 * Created by ApolloYr on 2/5/2018.
 */
import { Injectable } from "@angular/core";
import { Api } from "./api.service";

@Injectable()
export class SpecialEvent extends Api {

    public getSpecialEvent(data) {
        return this.post('/specialevent/getSpecialEvent', data);
    }
    
    
    public updateUpperlimit(data) {
        return this.post('/specialevent/updateUpperlimit', data);
    }

    public updateTelefonnummer(data) {
        return this.post('/specialevent/updateTelefonnummer', data);
    }

    public getLocations() {
        return this.get('/specialevent/getAllLocations');
    }

    public getLocalityById(data) {
        return this.post('/specialevent/getLocalityById', data);
    }

    public getAllLocality() {
        return this.get('/specialevent/getAllLocality');
    }
}