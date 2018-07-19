import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  depositList: Array<any> = [];
  loading: boolean = true;

  constructor(private service: AppService) { }

  ngOnInit() {
  	this.service.getDepositAddress()
  	.subscribe((resp:any)=>{
  		this.depositList = resp.data||[];
      this.loading = false;
  	})
  }

}
