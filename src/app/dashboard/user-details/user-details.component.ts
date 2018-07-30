import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AppService } from '../../app.service';
import { CustomValidators } from '../../signup/signup.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DashboardService } from '../dashboard.service';

import * as zxcvbn from "zxcvbn";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

	//@Output() close: EventEmitter<any> = new EventEmitter();
	@Input() user: any = null;
	inputForm: FormGroup;
	data: any = null;
	error: string = null;
	processing: boolean = true;
	success: boolean = false;

//	barColors: Array<string> = [];
//	colors: Array<string> = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];
//	passwordStrength: number = 0;


  	constructor(private service: AppService, private fb: FormBuilder, 
  		private router: Router, private route: ActivatedRoute,
  		private dashService: DashboardService) { }

	ngOnInit() {

		this.user = this.dashService.getUser();
		if(this.user == null || !this.user){
			this.router.navigate(['signin']);
		}

		this.service.getUserDetails()
		    .subscribe((resp: any) => {
		    	console.log(resp);
		    	this.processing = false;
		    	if(resp.status == "SUCCESS"){

			    	this.data = resp.data||{};

					//this.updateBarColors("");

					this.inputForm = this.fb.group({
					  firstName: [this.data.firstName, Validators.required ],
					  lastName: [this.data.lastName, Validators.required ],
					  profileName: [this.data.profileName, Validators.required ],
					  /*passwordGroup: this.fb.group({
					        pswd: ['', [
					            Validators.required
					        ]],
					        rePswd: ['', Validators.required]}, 
					    { validator: CustomValidators.childrenEqual}),*/
					  address1: [this.data.address1, Validators.required ],
					  address2: [this.data.address2, null ],
					  city: [this.data.city, null ],
					  zipCode: [this.data.zipCode, null ],
					  state: [this.data.state, null ],
					  country: [this.data.country, Validators.required ],
					  latitude: [this.data.latitude, null],
					  longitude: [this.data.longitude, null]
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

/*	updateBarColors(color): void {
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
*/

	formatAddress(formData: any): string{
		let address = "";

		if(formData.address1)
			address += formData.address1;
		if(formData.address2)
			address += ' ' + formData.address2;
		if(formData.city)
			address += ', ' + formData.city;
		if(formData.county)
			address += ', ' + formData.county;
		if(formData.state)
			address += ', ' + formData.state;
		if(formData.zip)
			address += ' - ' + formData.zip;
		if(formData.country)
			address += ', ' + formData.country;

		return address;
	}


	verify(){

	  	if(this.inputForm.invalid === true)
	  		return;

	  	this.user = null;
	  	this.error = null;
	  	this.processing = true;

	  	this.service.getGeoCoding( this.formatAddress(this.inputForm.value) )
	  	.subscribe((resp:any)=>{

			let data = {
				emailId: this.data.emailId,
				firstName: this.data.firstName,
				lastName: this.data.lastName,
				gaSecret: this.data.gaSecret,
				kycStatus: this.data.kycStatus,
				address1: this.inputForm.value.address1,
				address2: this.inputForm.value.address2,
				city: this.inputForm.value.city,
				country: this.inputForm.value.country,
				state: this.inputForm.value.state,
				zipCode: this.inputForm.value.zipCode,
				latitude: null,
				longitude: null,
				profileName: this.inputForm.value.profileName
				//,
				//pswd: this.inputForm.value.passwordGroup.pswd,
				//rePswd: this.inputForm.value.passwordGroup.rePswd
			};

	  		if(resp.results && resp.results.length>0){
	  			let address = resp.results[0];
	  			resp.results.forEach( (o)=>{
	  				if(o.geometry.location_type == 'ROOFTOP'){
	  					address = o;
	  					return false;
	  				}
	  			});
				if( address && address.geometry && address.geometry.location ){
		  			data.latitude = address.geometry.location.lat;
		  			data.longitude = address.geometry.location.lng;
		  		}

			  	this.service.updateUserDetails(data)
			  	.subscribe((resp:any)=>{
			  		this.processing = false;
			  		if(resp && resp.status === "SUCCESS"){
			  			this.success = true;
			  		}
			  		else {
			  			this.error = resp.errorDesc||"Failed to update profile";
			  		}
			  	}, ()=>{
			  		this.processing = false;
			  		this.error = "Failed to update profile";
			  	});  			
	  		} else {
	  			this.processing = false;
	  			this.error = "Invalid address, please provide valid address";
	  		}
	  	})
	}

 	dismiss(){
	  	//this.router.navigate(['signin']);
	  	//this.close.emit(this.user);
	}

	changePassword(){
		this.router.navigate(['dashboard/change-password']);
	}
}
