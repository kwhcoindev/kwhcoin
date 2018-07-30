import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

import { DashboardService } from '../dashboard/dashboard.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  //@Output() close: EventEmitter<any> = new EventEmitter();
  //@Input() user: any = null;
  inputForm: FormGroup;
  error: string = null;
  status: string = null;
  loading: boolean = false;

  constructor(private service: AppService, private dashService: DashboardService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
  	this.inputForm = this.fb.group({
	  emailId: ['', [Validators.required, Validators.email] ]
	});

	//this.user = this.service.getUser();
	//if(this.user && this.user.emailId)
	//	this.router.navigate(['dashboard/summary']);
  }

  sendResetPassword(){

  	if(this.inputForm.invalid === true)
  		return;

  	//this.user = null;
  	this.error = null;
    this.loading = true;

  	this.service.sendResetPassword(this.inputForm.value)
  	.subscribe((resp:any)=>{
      this.loading = false;
  		if(resp.status == "SUCCESS"){
  			this.status = resp.status;
        this.dashService.clear();
        this.service.logout();
  		}
  		else {
  			this.error = resp.errorDesc||"Failed to send reset password email, please try after sometime";
  		}
  	}, ()=>{
      this.loading = false;
  		this.error = "Oops! something went wrong, please contact support";
  	});

  }

  //dismiss(){
  //	this.close.emit(this.user);
  //}

}
