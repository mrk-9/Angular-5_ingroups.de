/**
 * Created by ApolloYr on 2/5/2018.
 */
import {NgModule} from '@angular/core';
import {SettingsService} from "./setting.service";
import {Api} from "./api.service";
import {AuthGuard} from "./authguard.service";
import {NotifyService} from "./notify.service";
import {Validate} from "./validate.service";
import {ClientApi} from "./clientapi.service";
import {MessageService} from 'primeng/components/common/messageservice';
import {AuthCheck} from "./authcheck.service";
import {PusherService} from "./pusher.service";
import {MessagingService} from "./messaging.service";
import {SpecialEvent} from "./specialevent.service";


@NgModule({
    imports: [

    ],
    declarations: [],
    providers: [
        SettingsService,
        Api,
        AuthGuard,
        NotifyService,
        ClientApi,
        Validate,
        MessageService,
        AuthCheck,
        PusherService,
        MessagingService,
        SpecialEvent
    ],
    exports: [

    ]
})
export class ServicesModule {

}
