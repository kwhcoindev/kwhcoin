import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {

	@Input() user: any = null;
	@Input() wallet: any = null;

	constructor(private service: AppService, private router: Router,  private modalService: NgbModal) { }

 	ngOnInit() {
 		//this.wallet = {kwhBalance: 300000, ethBalance: 200};
  	}

  	signout(){
  		this.service.logout();
		  this.router.navigate(['signin']);  		
  	}

    showProfile(){
      this.router.navigate(['dashboard/my-profile']);
    }

  openDepositWithdraw(content) {
    this.modalService.open(content, {size: 'lg'}).result
    .then((result) => {
      //this.closeResult = `Closed with: ${result}`;
      //this.onTrackCoinSubmit();
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
