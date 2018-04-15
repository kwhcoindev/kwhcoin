import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	user: any = {id: 1, name: "Your Name", email: "dummy@kwhcoin.com"};
	wallet: any = {balance: 0};

  	constructor(private service: AppService, private router: Router) { }

  	ngOnInit() {
	  	this.service.validateLogin({})
	  	.subscribe((resp)=>{
	  		this.user = resp;

	  		if(!this.user||!this.user.id)
	  			this.router.navigate(['']);
	  	});  
	}

}
