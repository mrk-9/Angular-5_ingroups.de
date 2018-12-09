/**
 * Created by ApolloYr on 2/3/2018.
 */

import {Component} from "@angular/core";
import {SettingsService} from "../services/setting.service";
@Component({
    selector: 'page-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
    constructor(public setting: SettingsService) {

    }
}