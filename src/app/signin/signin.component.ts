import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() user: any = null;
  inputForm: FormGroup;
  error: string = null;

  constructor(private service: AppService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
  	this.inputForm = this.fb.group({
	  emailId: ['', [Validators.required, Validators.email] ],
	  pswd: ['', null ]
	});

  }

  login(){

  	if(this.inputForm.invalid === true)
  		return;

  	this.user = null;
  	this.error = null;

  	this.service.login(this.inputForm.value)
  	.subscribe((resp)=>{
  		if(resp && resp.token){
  			this.user = resp;
		  	this.router.navigate(['dashboard/summary']);
  			this.dismiss();
  		}
  		else {
  			this.error = resp.errorDesc||"Failed to login";
  		}
  	}, ()=>{
  		this.error = "Failed to login";
  	});

  }

  dismiss(){
  	this.close.emit(this.user);
  }
}
