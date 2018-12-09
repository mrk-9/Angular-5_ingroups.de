/**
 * Created by Alex on 5/18/2018.
 */
import {Component, OnInit} from "@angular/core";
import {ClientApi} from "../services/clientapi.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Validate} from "../services/validate.service";
import {ActivatedRoute} from "@angular/router";
import {NotifyService} from "../services/notify.service";
@Component({
    selector: 'page-resetpassword',
    templateUrl: './resetpassword.component.html',
    styleUrls: ['./resetpassword.component.scss']
})
export class ResetPasswordComponent implements OnInit{

    public loading = false;
    public success = false;

    public form: FormGroup;

    private sub: any;

    constructor(
        public api: ClientApi,
        public formBuilder: FormBuilder,
        public validate: Validate,
        public activateRoute: ActivatedRoute,
        public notify: NotifyService
    ) {

    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            password: ['', Validators.required],
            repeat_password: ['', Validators.required],
            confirmcode: ['', Validators.required]
        })

        this.sub = this.activateRoute.params.subscribe(params => {
            if (params.confirmcode) {
                this.form.controls['confirmcode'].setValue(params.confirmcode);
            }
        })
    }

    resetPassword() {
        if (this.form.valid) {

            if (this.form.value.password != this.form.value.repeat_password) {
                alert("Password and repeat password doesn't match");
                return;
            }

            this.loading = true;

            this.api.resetPassword(this.form.value).subscribe(res => {
                if (res.success == true) {
                    this.loading = false;
                    this.success = true;
                } else {
                    this.notify.showNotification('warn', 'failed');
                }
            }, error => {
                this.loading = false;
            })

        } else {
            this.validate.validateAllFormFields(this.form);
        }
    }
}