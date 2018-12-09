/**
 * Created by ApolloYr on 4/26/2018.
 */
import { Component, OnInit } from "@angular/core";
import { ClientApi } from "../services/clientapi.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Validate } from "../services/validate.service";
import { NotifyService } from "../services/notify.service";
import { SettingsService } from "../services/setting.service";
import { Router } from "@angular/router";
import { PusherService } from "../services/pusher.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ForgotPasswordModalComponent } from "../shared/modal/forgot-password-modal/forgot-password-modal.component";
import { MessagingService } from "../services/messaging.service";
import { VerifyModalComponent } from "../shared/modal/verify-modal/verify-modal.component";
@Component({
    selector: 'page-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public loading = false;
    form: FormGroup;

    public verificationError = false;

    constructor(
        public api: ClientApi,
        public formBuilder: FormBuilder,
        public validate: Validate,
        public notify: NotifyService,
        public setting: SettingsService,
        public router: Router,
        public pusher: PusherService,
        private modalService: NgbModal,
        private msgService: MessagingService
    ) {

    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            password: ['', Validators.required],
        })

    }

    login() {
        if (this.form.valid) {
            this.loading = true;

            this.api.login(this.form.value).subscribe(res => {
                this.loading = false;

                if (res.success == true) {

                    if (res.verified) {
                        this.router.navigate(['/']);

                        this.setting.setAppSetting('is_loggedin', true);

                        this.setting.user = res;
                        this.setting.setStorage('email', this.form.value.email);
                        this.setting.setStorage('password', this.form.value.password);
                        this.setting.setStorage('token', res.token);

                        this.msgService.loadContactList();

                        this.pusher.connect();
                    } else {
                        this.verificationError = true;
                    }
                } else {
                    this.notify.showNotification('error', 'invalid credentical');
                }
            }, error => {
                this.loading = false;
            })

        } else {
            this.validate.validateAllFormFields(this.form);
        }
    }

    forgotPassword() {
        this.modalService.open(ForgotPasswordModalComponent, { backdrop: 'static' });
    }

    resendVerifyEmail() {
        this.modalService.open(VerifyModalComponent, { backdrop: 'static' });
    }
}