import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AppService } from '../app.service';
import { CustomValidators } from '../signup/signup.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import * as zxcvbn from "zxcvbn";


@Component({
  selector: 'app-verify-reset-password',
  templateUrl: './verify-reset-password.component.html',
  styleUrls: ['./verify-reset-password.component.scss']
})
export class VerifyResetPasswordComponent implements OnInit {

	inputForm: FormGroup;
	data: any = null;
	error: string = null;
	status: string = null;
	showForm: boolean = false;
	processing: boolean = true;

	barColors: Array<string> = [];
	colors: Array<string> = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];
	passwordStrength: number = 0;


  	constructor(private service: AppService, private fb: FormBuilder, 
  		private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {

		this.route.queryParamMap
		    .switchMap((params: ParamMap) => this.service.verifyResetPassword(params.get('vid')))
		    .subscribe(resp => {
		    	console.log(resp);
		    	this.processing = false;
		    	if(resp.status == "SUCCESS"){
			    	//else redirect to update user after storing the user data in common service

			    	this.showForm = true;
			    	this.data = resp.data||{};

					this.updateBarColors("");

					this.inputForm = this.fb.group({
					  passwordGroup: this.fb.group({
					        pswd: ['', [
					            Validators.required
					        ]],
					        rePswd: ['', Validators.required]}, 
					    { validator: CustomValidators.childrenEqual})
					});

		    	} else {
			    	//If false show message from service
			    	this.error = resp.errorDesc;
		    	}
		    }, ()=>{
		    	this.processing = false;
		    	this.error = "Oops! something went wrong, please try after sometime.";
		    });

	}

	updateBarColors(color): void {
		this.barColors = [];
		for (let i = 0; i < 5; i++) {
			this.barColors.push((i <= this.passwordStrength) ? color : '');
		}
	}

	updatePasswordStrength(): void {
		let results = zxcvbn(this.inputForm.controls.passwordGroup.value.pswd);
		this.passwordStrength = results.score;
 		
		let color = this.colors[this.passwordStrength];
		this.updateBarColors(color);
	}

	changePassword(){

	  	if(this.inputForm.invalid === true)
	  		return;

	  	this.error = null;
	  	this.processing = false;

		let data = {
			emailId: this.data.emailId,
			//firstName: this.data.firstName,
			//lastName: this.data.lastName,
			//gaSecret: this.data.gaSecret,
			//kycStatus: this.data.kycStatus,
			//address1: this.inputForm.value.address1,
			//address2: this.inputForm.value.address2,
			//city: this.inputForm.value.city,
			//country: this.inputForm.value.country,
			//state: this.inputForm.value.state,
			//zipCode: this.inputForm.value.zipCode,
			//latitude: null,
			//longitude: null,
			//profileName: this.inputForm.value.profileName,
			pswd: this.inputForm.value.passwordGroup.pswd,
			rePswd: this.inputForm.value.passwordGroup.rePswd
		};

	  	this.service.resetPassword(data)
	  	.subscribe((resp)=>{
	  		this.processing = false;
	  		if(resp && resp.status === "SUCCESS"){
	  			this.status = resp.status;
	  			this.showForm = false;
	  			this.dismiss();
	  		}
	  		else {
	  			this.error = resp.errorDesc||"Failed to reset password";
	  		}
	  	}, ()=>{
	  		this.processing = false;
	  		this.error = "Failed to reset password";
	  	});  			
	}

	gotoSignIn() {
		this.router.navigate(['signin']);	
	}
 
	dismiss(){
	  	//this.close.emit(this.user);
	}

}
