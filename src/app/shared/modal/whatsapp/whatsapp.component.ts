import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SpecialEvent } from "../../../services/specialevent.service";

@Component({
  selector: 'page-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss']
})
export class WhatsappModalComponent implements OnInit {
  @Input() event;

  public whatsappNum = '';
  public count = 0;

  public updateData ={
    id : '',
    Telefonnummer : ''
  }

  constructor(
    public activeModal: NgbActiveModal,
    public api: SpecialEvent
  ) {

  }

  ngOnInit() {
    this.updateData.id = this.event.id;
    if(this.event.Telefonnummer != '' && this.event.Telefonnummer != null){
      this.whatsappNum = this.event.Telefonnummer;
      this.updateData.Telefonnummer = this.event.Telefonnummer ;
      console.log("Watsapp Number : "+this.whatsappNum);
    }
  }

  updateNumber(){
    this.count = 0;   
  }

  activateMessaging(whatsappNum){
    if(this.count < 1){
      var regex = /[1-9]{1}[0-9]{9}/;
      if(regex.test(whatsappNum) == true && whatsappNum.length == 10){
        this.updateData.Telefonnummer = whatsappNum ;
        this.api.updateTelefonnummer(this.updateData).subscribe(res => {
          if (res.success) {
            this.event.Telefonnummer = whatsappNum;
            alert("Nachrichten Bedienung aktiviert.");
          }
        });
        this.count++;
      }else{
        alert("Eingeben Korrekte 10 Ziffern Nummer");
      }        
    }  
    else{
      alert("Bereits aktiviert.");
    }  
  }
}