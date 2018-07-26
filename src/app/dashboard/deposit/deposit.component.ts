import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  @Output() done: EventEmitter<any> = new EventEmitter();

  depositList: Array<any> = [];
  loading: boolean = true;
  error: string = null;

  constructor(private service: AppService) { }

  ngOnInit() {
  	this.service.getDepositAddress()
  	.subscribe((resp:any)=>{
  		this.depositList = resp.data||[];
      this.loading = false;
  	},()=>{
        this.loading = false;
        this.error = "Oops! something went wrong, please try again later.";
    })
  }

  close(){
      this.done.emit();
  }

}
