import { Component, Input, OnInit} from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClientApi } from "../../../services/clientapi.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Validate } from "../../../services/validate.service";
import { SettingsService } from "../../../services/setting.service";
import { NotifyService } from "../../../services/notify.service";

declare var $: any;
@Component({
  selector: 'contact2user-form',
  templateUrl: './contact2user-form.component.html',
  styleUrls: ['./contact2user-form.component.scss']
})
export class Contact2UserFormComponent implements OnInit {
  
  @Input() item;

  info = {
    image: '',
    message: '',
  }
  public userImage = '';
  public form: FormGroup;
  public loading = false;

  constructor(

    public api: ClientApi,
    public formBuilder: FormBuilder,
    public validate: Validate,
    public notify: NotifyService,
    public setting: SettingsService,
    public activeModal: NgbActiveModal
  ) {

  }

  ngOnInit() {
    this.userImage = this.item.Bild;
    this.form = this.formBuilder.group({
      message: ['', Validators.required],
    })
    this.info.image = this.setting.getUserSetting('photo');
  }
  
  fileChangeListener($event) {
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
        this.info.image = this.setting.serverUrl + res.url;
        console.log(this.info.image);
      }
    })
  }

  cancel() {
    this.activeModal.dismiss();
  }

  submit() {
    if (this.form.valid) {
      this.loading = true;
      
      this.api.contact2User({
          message: this.info.message,
          image: this.info.image,
          createrId: this.item.contacterId,
          createrImage: this.item.Bild,
          eventId: this.item.eventId,
          location: this.item.location
      }).subscribe(res => {
          this.loading = false;
          if (res.success) {
              this.notify.showNotification('success', "successfully contacted");
              this.activeModal.dismiss();
          } else {
              this.notify.showNotification('warn', res.error);
              this.activeModal.dismiss();
          }
      }, error => {
          this.loading = false;
      })
    } else {
      this.validate.validateAllFormFields(this.form);
    }
  }
}