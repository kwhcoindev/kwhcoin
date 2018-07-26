import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../app.service';


@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {

  @Output() done: EventEmitter<any> = new EventEmitter();

  inputForm: FormGroup;
  error: string = null;
  loading: boolean = false;

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
  	this.loading = true;

  	this.service.transfer(this.inputForm.value)
  	.subscribe((resp:any)=>{
		this.loading = false;  			
  		if(resp.status == "SUCCESS"){
  			this.done.emit();
  		}
  		else {
  			this.error = resp.errorDesc||"Failed to submit the transfer, please try again later";
  		}
  	}, ()=>{
		this.loading = false;  	
  		this.error = "Oops! something went wrong, please contact support";
  	});
  }

  close(){
      this.done.emit();
  }

}
