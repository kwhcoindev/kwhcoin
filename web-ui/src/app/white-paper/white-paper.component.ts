import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-white-paper',
  templateUrl: './white-paper.component.html',
  styleUrls: ['./white-paper.component.scss']
})
export class WhitePaperComponent implements OnInit {

	whitePaperList : Array<any> = [];
	message: string;

  	constructor(private http: Http, private modalService: NgbModal) { }

  	ngOnInit() {
  		let baseUrl = '//api.kwhcoin.com/';
          this.http.post( baseUrl + 'service/white-paper-list.php', {})
          .subscribe((resp)=>{
            let data = resp.json();
            this.whitePaperList = data.list||[];

            this.whitePaperList.forEach(o=>{
            	o.url = baseUrl + o.url + '?'+ o.date;
            });
          },()=>{
            this.message = "Failed to get the white papers, please try after sometime";
          });
  	}

  	openModal(content){
	    this.modalService.open(content).result.then((result) => {
	      
	    }, (reason) => {
	      
	    });
  	}

}
