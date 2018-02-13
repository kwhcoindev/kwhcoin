import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Http } from '@angular/http';

import * as moment from 'moment';

declare var jQuery;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    date = "02-08-2018 20:00:00+00:00";
    dateStr = moment(this.date, "MM-DD-YYYY hh:mm:ssZ").format("MMMM Do");

    status: number;
    message: string;
    public trackForm: FormGroup;
    public trackCoinData: any;

  	constructor(private fb: FormBuilder, private http: Http, private modalService: NgbModal) { }

  	ngOnInit() {
	  	jQuery('#coin_widget').html('<div class="cmw-widget-icocoin" data-ticker="KWH" style="font-size:18px;max-width:320px;min-width:320px"></div><script type="text/javascript" src="assets/js/ico-widget.js?_'+ (new Date()).getTime() +'"></script>');

      this.trackForm = this.fb.group({
        address: ['', Validators.required ]
      });
  	}

    openTrackModal(content){
      this.trackCoinData = null;
      this.trackForm = this.fb.group({
        address: ['', Validators.required ]
      });

      this.modalService.open(content).result
      .then((result) => {
        //this.closeResult = `Closed with: ${result}`;
        //this.onTrackCoinSubmit();
      }, (reason) => {
        //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    public onTrackCoinSubmit(){
      if(!this.trackForm.pristine && !this.trackForm.invalid){

        this.http.get('https://api.etherscan.io/api?module=account&action=tokenbalance&tag=latest&apikey=I8BPFH9HMVTPI3QBE87J91ZFMTG6Z7SAB1&contractaddress=0xebc7cd2684dd96619841c7994343c5a8bda94b10&address='+ this.trackForm.value.address, this.trackForm.value)
        .subscribe((resp)=>{
          this.trackCoinData = resp.json();
          this.trackCoinData.result = this.trackCoinData.result/1000000000000000000;
          this.status = 200;
        },()=>{
          this.status = 500;
          this.message = "Failed to submit the information, please try after sometime";
        })
      }
    }

}
