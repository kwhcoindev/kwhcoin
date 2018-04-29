import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {

	@Input() user: any = null;
	@Input() wallet: any = null;

	constructor(private service: AppService) { }

 	ngOnInit() {
 		this.wallet = {kwhBalance: 300000, ethBalance: 200};
  	}

}
