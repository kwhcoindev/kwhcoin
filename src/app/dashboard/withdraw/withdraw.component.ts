import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../app.service';


@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {

  inputForm: FormGroup;
  error: string = null;

  constructor(private service: AppService, private fb: FormBuilder) { }

  ngOnInit() {

  	this.inputForm = this.fb.group({
  		addressType: ['', Validators.required ],
	  	toAddress: ['', [Validators.required, Validators.minLength(42), Validators.maxLength(42)] ],
	  	value: ['', [Validators.required, Validators.min(0.000000000000001), Validators.pattern('^(-)?[0-9]*(\.[0-9]*)?$')] ]
	  });
  }

  withdraw(){

  	if(this.inputForm.invalid === true)
  		return;

  	this.error = null;

  	this.service.transfer(this.inputForm.value)
  	.subscribe((resp:any)=>{
  		if(resp.status == "SUCCESS"){
  			
  			this.done();
  		}
  		else {
  			this.error = resp.errorDesc||"Failed to submit the transfer, please try again later";
  		}
  	}, ()=>{
  		this.error = "Oops! something went wrong, please contact support";
  	});
  }


  done(){
  	console.log("done");
  }

}
