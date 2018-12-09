/**
 * Created by ApolloYr on 4/27/2018.
 */
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ClientApi } from "../services/clientapi.service";
import { Validate } from "../services/validate.service";
import { NotifyService } from "../services/notify.service";
import { SettingsService } from "../services/setting.service";
import { Router } from "@angular/router";
import { PusherService } from "../services/pusher.service";
import { MessagingService } from "../services/messaging.service";

declare var $: any;
declare var moment: any;
@Component({
    selector: 'page-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    form: FormGroup;
    public loading = false;
    public birthday: any;

    public sentVerifiedEmail = false;

    settings = {
        bigBanner: false,
        timePicker: false,
        format: 'dd-MM-yyyy',
        defaultOpen: false
    };
    public convertedDate = '';
    constructor(
        public api: ClientApi,
        public formBuilder: FormBuilder,
        public validate: Validate,
        public notify: NotifyService,
        public setting: SettingsService,
        public router: Router,
        public pusher: PusherService,
        public msgService: MessagingService
    ) {

    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            birthday: ['', Validators.required],
            email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            password: ['', Validators.required],
            repeat_password: ['', Validators.required],
            terms: [''],
            privacy: ['']
        })

        this.form.controls['terms'].setValue(false);
        this.form.controls['privacy'].setValue(false);
    }

    ngAfterViewInit() {
        $(".wc-date-container").css({ "border": "none", "padding": "7px 12px" });
        $(".wc-date-container").find('span').css({ "color": "#958da0" });
        $(".wc-date-container").find('i').css({ "color": "#958da0" });
    }

    register() {
        if (this.form.valid) {
            if (!this.form.value.terms) {
                alert('You must agree to the terms and conditions');
                return;
            }

            if (!this.form.value.privacy) {
                alert('You must agree to the privacy policy');
                return;
            }

            if (this.form.value.password != this.form.value.repeat_password) {
                alert("Password and repeat password doesn't match");
                return;
            }

            this.form.value.birthday = this.convertedDate;

            this.loading = true;

            this.api.register(this.form.value).subscribe(res => {
                if (res.success == true) {
                    this.loading = false;

                    // this.router.navigate(['/profile']);

                    // this.setting.user = res;
                    // this.setting.setAppSetting('is_loggedin', true);

                    // this.setting.setStorage('email', this.form.value.email);
                    // this.setting.setStorage('password', this.form.value.password);
                    // this.setting.setStorage('token', res.token);

                    // this.msgService.loadContactList();

                    // this.pusher.connect();

                    this.sentVerifiedEmail = true;
                } else {
                    this.notify.showNotification('warn', res.error);
                    this.loading = false;
                }
            }, error => {
                this.loading = false;
            })

        } else {
            this.validate.validateAllFormFields(this.form);
            alert("All fields required");
        }
    }

    convert(stringDate) {
        if (stringDate != null && stringDate != '') {
            var date = moment(new Date(stringDate.substr(0, 16)));
            this.convertedDate = date.format("YYYY-MM-DD");
        }
    }
}