import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { NgbDatepickerConfig, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../app.constants';

import * as moment from 'moment';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  list: Array<any> = [];

  constructor(private http: Http) { }

  ngOnInit() {
  	this.getList();
  }

  getList() {
  	this.http.get(AppConstants.API_URL + 'service/events.php?list')
  	.subscribe((resp: any)=>{
  		this.list = resp.json().data||[];
  	console.log(this.list);
  	});
  }

  getDate(str) {
  	let dt = moment(str, 'YYYY-MM-DD HH:mm:ss');
  	return dt.format('MMM') +' '+ dt.format('DD');
  }

  getDay(str) {
  	let dt = moment(str, 'YYYY-MM-DD HH:mm:ss');
  	return dt.format('ddd');
  }

}
