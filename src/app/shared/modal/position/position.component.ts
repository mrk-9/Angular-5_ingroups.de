import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SpecialEvent } from "../../../services/specialevent.service";

@Component({
  selector: 'page-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionModalComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) {

  }

  ngOnInit() {
  }

  setPosition(position){
    this.activeModal.close({positionValue: position});
  }

}