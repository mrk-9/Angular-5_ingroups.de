import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'page-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryModalComponent implements OnInit {
  @Input() item;
  public imageUrl;
  public age;
  public name;

  constructor(
    public activeModal: NgbActiveModal
  ) {

  }

  ngOnInit() {
    this.name = this.item.partnerName;
    this.imageUrl = this.item.partnerPhoto;    
    this.age = this.getAge(this.item.partnerBirthday);
  }

  getAge(birthday){
    let dob = new Date(birthday);
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }
}