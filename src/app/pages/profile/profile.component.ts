/**
 * Created by ApolloYr on 4/30/2018.
 */
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ClientApi } from "../../services/clientapi.service";
import { NotifyService } from "../../services/notify.service";
import { SettingsService } from "../../services/setting.service";

declare var $: any;
declare var moment: any;
@Component({
    selector: 'page-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    settings = {
        bigBanner: false,
        timePicker: false,
        format: 'yyyy-MM-dd',
        defaultOpen: false
    };
    public convertedDate = '';
    public mode = 'view';

    public info: any = '';
    public editInfo: any;

    public form: FormGroup;

    constructor(
        public api: ClientApi,
        public notify: NotifyService,
        public setting: SettingsService
    ) {

    }

    ngOnInit() {


        this.notify.showLoading();
        this.api.getProfiile().subscribe(res => {
            this.notify.hideLoading();

            if (res.success) {
                this.info = res.data;

                console.log(res);
            }
        }, error => {
            this.notify.hideLoading();
        })
    }

    editProfile() {
        this.editInfo = Object.assign({}, this.info);
        console.log(this.editInfo);
        this.mode = 'edit';
        setTimeout(function () {
            $(".wc-date-container").css({ "border": "none", "padding": "7px 9px" });
            $(".wc-date-container").find('span').css({ "color": "#495057" });
            $(".wc-date-container").find('i').css({ "color": "#495057" });
        }, 10);
    }

    viewProfile() {
        this.mode = 'view';
    }

    saveProfile() {
        if (this.convertedDate != '' && this.convertedDate != null) {
            this.editInfo.birthday = this.convertedDate;
        }
        this.api.saveProfile(this.editInfo).subscribe(res => {
            if (res.success) {
                this.info = res.data;
                this.mode = 'view';

                this.setting.setUserSetting('photo', res.data.photo);
                console.log(res.data.photo);
                console.log(this.setting.getUserSetting('photo'))
            }
        })
    }

    uploadPhoto($event) {
        let file: File = $event.target.files[0];

        if (typeof file == 'undefined') return;

        var fileType = file["type"];
        var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];

        if ($.inArray(fileType, ValidImageTypes) < 0) {
            alert('you must upload image file: *.gif, *.jpg, *.png');
            return;
        }

        this.api.uploadImage(file).subscribe(res => {
            if (res.success) {
                this.editInfo.photo = this.setting.serverUrl + res.url;
            }
        })
    }

    removePhoto() {
        this.editInfo.photo = '';
    }

    convert(stringDate) {
        if (stringDate != null && stringDate != '') {
            var date = moment(new Date(stringDate.substr(0, 16)));
            this.convertedDate = date.format("YYYY-MM-DD");
        }
    }
}