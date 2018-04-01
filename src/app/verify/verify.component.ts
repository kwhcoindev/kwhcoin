import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AppService } from '../app.service';
import { CustomValidators } from '../signup/signup.component';


@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  //@Output() close: EventEmitter<any> = new EventEmitter();
  @Input() user: any = null;
  inputForm: FormGroup;
  error: string = null;

  constructor(private service: AppService, private fb: FormBuilder) { }

  ngOnInit() {
  	this.inputForm = this.fb.group({
	  email: ['', [Validators.required, Validators.email] ],
	  passwordGroup: this.fb.group({
            password: ['', [
                Validators.required
            ]],
            confirmPassword: ['', Validators.required]}, 
        { validator: CustomValidators.childrenEqual})
	});

  }

  verify(){
  	if(this.inputForm.invalid === true)
  		return;

  	this.user = null;
  	this.error = null;

  	this.service.verify(this.inputForm.value)
  	.subscribe((resp)=>{
  		if(resp && resp.ok === true){
  			this.user = resp;
  			this.dismiss();
  		}
  		else {
  			this.error = resp.message||"Failed to change the password";
  		}
  	}, ()=>{
  		this.error = "Failed to change the password";
  	});

  }

  dismiss(){
  	
  }

}
