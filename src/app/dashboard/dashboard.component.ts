import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	user: any = null;
	wallet: any = {erc20Balance: 0, ethBalance: 0};

  	constructor(private service: AppService, private router: Router) { }

  	ngOnInit() {
  		this.user = this.service.getUser();
	  	/*this.service.validateLogin({})
	  	.subscribe((resp)=>{
	  		this.user = resp;

	  		if(!this.user||!this.user.id)
	  			this.router.navigate(['']);
	  	});*/  
  		if(!this.user||!this.user.emailId)
  			this.router.navigate(['signin']);
  		else {
  			this.getBalance();
  		}
	}

	getBalance(){
		this.service.getERC20Balance()
		.subscribe((resp)=>{
			this.wallet.erc20Balance = resp.data||{};
		})

		this.service.getEthBalance()
		.subscribe((resp)=>{
			this.wallet.ethBalance = resp.data||{};
		})
	}
}
