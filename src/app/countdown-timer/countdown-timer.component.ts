import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit {
	
	@Input() date: string;
	releaseDate: any;
	diff: number;
	days: Array<string> = [];
	hours: Array<string> = [];
	minutes: Array<string> = [];
	seconds: Array<string> = [];

	timer: any;

  	constructor() { }

	ngOnInit() {
		
		this.releaseDate = moment(this.date, "MM-DD-YYYY hh:mm:ss");
		
		this.calculate();

		this.timer = setInterval(()=>{
			this.calculate();
		}, 1000);
	}

	ngOnDestroy(){
		if(this.timer) clearInterval(this.timer);
	}

	calculate() {
		let now = moment();
		let t = 0, part = 0;

		this.diff = this.releaseDate.diff( now, 's');

		t = this.diff;
		part = Math.floor(t/(24 * 3600));
		this.days = (part+'').split('');

		t -= part*24*3600;
		part = Math.floor(t/3600);
		this.hours = (part+'').split('');

		t -= part*3600;
		part = Math.floor(t/(60));
		this.minutes = (part+'').split('');

		t -= part*60;
		this.seconds = (t+'').split('');

		//console.log(this.diff);
	}

}
