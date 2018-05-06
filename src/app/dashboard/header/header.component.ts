import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';

@Component({
  selector: 'dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {

	@Input() user: any = null;
	@Input() wallet: any = null;

	constructor(private service: AppService, private router: Router) { }

 	ngOnInit() {
 		this.wallet = {kwhBalance: 300000, ethBalance: 200};
  	}

  	signout(){
  		this.service.logout();
		this.router.navigate(['signin']);  		
  	}

}
