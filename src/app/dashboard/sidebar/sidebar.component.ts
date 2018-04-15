import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'dashboard-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

	@Input() user: any = {};
	@Input() wallet: any = null;

	constructor(private service: AppService) { }

 	ngOnInit() {
 		this.wallet = {balance: 300000};
  	}

}
