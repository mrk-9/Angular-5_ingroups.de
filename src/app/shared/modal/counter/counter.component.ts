import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SpecialEvent } from "../../../services/specialevent.service";

@Component({
  selector: 'page-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  @Input() event;
  @Input() number;

  public counterLimit = 0;
  public newEvent = false;

  public counterData ={
    id : '',
    upperlimit : -1
  }

  constructor(
    public activeModal: NgbActiveModal,
    public api: SpecialEvent
  ) {

  }

  ngOnInit() {
    if(this.event == null || this.event == ''){
      this.newEvent = true;
      if(this.number != '' && this.number != null){
        this.counterLimit = this.number;
      }      
    }
    else{
      this.counterData.id = this.event.event_location_id;
      if(this.event.event_location_upperlimit != '' && this.event.event_location_upperlimit != null && this.event.event_location_upperlimit != -1){
        this.counterLimit = this.event.event_location_upperlimit;
        this.counterData.upperlimit = this.event.event_location_upperlimit;  
        console.log("this.counterLimit : "+this.counterLimit);   
      }
    }    
  }

  setUpperlimit(){
    var regex = /[1-9]{1}/;
    if(regex.test(this.counterLimit.toString()) == true){
      this.counterData.upperlimit = this.counterLimit;
    }
    else{
      alert("Eingeben Korrekte Zähler");
    }
  }

  setNolimit(){
    this.counterData.upperlimit = -1;
    this.counterLimit = -1;
    alert("Zähler Wert aktualisiert zu unendlich");
  }

  counter(){
    if(this.newEvent){
      this.activeModal.close({counterValue: this.counterLimit});
    }else{
      this.api.updateUpperlimit(this.counterData).subscribe(res => {
        if (res.success) {
          this.event.event_location_upperlimit = this.counterData.upperlimit;
          alert("Zähler Wert aktualisiert.");
          this.activeModal.dismiss();
        }
      });
    }    
  }
}