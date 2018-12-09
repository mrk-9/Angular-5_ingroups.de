/**
 * Created by ApolloYr on 4/26/2018.
 */
import {Component} from "@angular/core";
import {SettingsService} from "../../services/setting.service";
@Component({
    selector: 'page-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    constructor(public setting: SettingsService) {

    }
}