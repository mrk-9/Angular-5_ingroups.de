/**
 * Created by ApolloYr on 1/29/2018.
 */
import {Injectable, ViewContainerRef} from "@angular/core";
import {MessageService} from 'primeng/components/common/messageservice';
import {SettingsService} from "./setting.service";

@Injectable()
export class NotifyService {

    constructor(
        public messageService: MessageService,
        public setting: SettingsService
    ) {
    }

    showNotification(type, message) {
        this.messageService.add({severity: type, summary: message});
    }

    showLoading() {
        this.setting.loading = true;
    }

    hideLoading() {
        this.setting.loading = false;
    }


}
