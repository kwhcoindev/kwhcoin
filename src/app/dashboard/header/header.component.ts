import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {

	@Input() user: any = null;
  	constructor() { }

  	ngOnInit() {
  	}

}
