import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../app.service';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	user: any = null;
	users: Array<any> = null;
	wallet: any = {erc20Balance: 0, ethBalance: 0};

  	constructor(private service: AppService, private dashService: DashboardService, private router: Router) { }

  	ngOnInit() {
  		this.user = this.service.getUser();

  		if(!this.user||!this.user.emailId)
  			this.router.navigate(['signin']);
  		else {

	  		this.dashService.setUser( this.user );

			this.service.getUsers()
			.subscribe((resp:any)=>{
				
				this.users = resp.data||[];
		  		this.dashService.setUsers( this.users );

			});

  			this.getBalance();
  		}
	}

	getBalance(){
		this.service.getERC20Balance()
		.subscribe((resp:any)=>{
			if(resp.errorDesc == 'Invalid token, please login.'){
				this.service.logout();
				this.router.navigate(['signin']);
			} else {
				this.wallet.erc20Balance = resp.data||0;
			}
		})

		this.service.getEthBalance()
		.subscribe((resp:any)=>{
			if(resp.errorDesc == 'Invalid token, please login.'){
				this.service.logout();
				this.router.navigate(['signin']);
			} else {
				this.wallet.ethBalance = resp.data||0;
			}
		})
	}
}
