import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AppService } from '../app.service';
import { CustomValidators } from '../signup/signup.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import * as zxcvbn from "zxcvbn";


@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

	//@Output() close: EventEmitter<any> = new EventEmitter();
	@Input() user: any = null;
	inputForm: FormGroup;
	data: any = null;
	error: string = null;
	showForm: boolean = false;
	processing: boolean = true;

	barColors: Array<string> = [];
	colors: Array<string> = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];
	passwordStrength: number = 0;


  	constructor(private service: AppService, private fb: FormBuilder, 
  		private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {

		this.route.queryParamMap
		    .switchMap((params: ParamMap) => this.service.verifyUser(params.get('vid')))
		    .subscribe(resp => {
		    	console.log(resp);
		    	this.processing = false;
		    	//if(resp.status == "SUCCESS"){
			    	//else redirect to update user after storing the user data in common service

			    	this.showForm = true;
			    	this.data = resp.data||{};

					this.updateBarColors("");

					this.inputForm = this.fb.group({
					  //firstName: ['', Validators.required ],
					  //lastName: ['', Validators.required ],
					  emailId: [{value: this.data.emailId, disabled: true}, Validators.required],
					  profileName: ['', Validators.required ],
					  passwordGroup: this.fb.group({
					        pswd: ['', [
					            Validators.required
					        ]],
					        rePswd: ['', Validators.required]}, 
					    { validator: CustomValidators.childrenEqual}),
					  address1: ['', Validators.required ],
					  address2: ['', null ],
					  city: ['', null ],
					  zipCode: ['', null ],
					  state: ['', null ],
					  country: ['', Validators.required ],
					  latitude: ['', null],
					  longitude: ['', null]
					});

		    	//} else {
			    	//If false show message from service
			    //	this.error = resp.errorDesc;
		    	//}
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

	formatAddress(formData: any): string{
		let address = "";

		if(formData.street1)
			address += formData.street1;
		if(formData.street2)
			address += ' ' + formData.street2;
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
	  	this.processing = false;

	  	this.service.getGeoCoding( this.formatAddress(this.inputForm.value) )
	  	.subscribe((resp)=>{

			let data = {
				address1: this.inputForm.value.address1,
				address2: this.inputForm.value.address2,
				city: this.inputForm.value.city,
				country: this.inputForm.value.country,
				state: this.inputForm.value.state,
				zipCode: this.inputForm.value.zipCode,
				latitude: null,
				longitude: null,
				profileName: this.inputForm.value.profileName,
				pswd: this.inputForm.value.passwordGroup.pswd,
				rePswd: this.inputForm.value.passwordGroup.rePswd
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
			  	.subscribe((resp)=>{
			  		this.processing = false;
			  		if(resp && resp.status === "SUCCESS"){
					  	this.router.navigate(['signin']);
			  			//this.user = resp;
			  			this.dismiss();
			  		}
			  		else {
			  			this.error = resp.errorDesc||"Failed to update profile";
			  		}
			  	}, ()=>{
			  		this.processing = false;
			  		this.error = "Failed to update profile";
			  	});  			
	  		} else {
	  			this.error = "Invalid address, please provide valid address";
	  		}
	  	})
	}

 
	register(){
		console.log(this.inputForm)
	  	if(this.inputForm.invalid === true)
	  		return;

	  	this.user = null;
	  	this.error = null;

	  	this.service.register(this.inputForm.value)
	  	.subscribe((resp)=>{
	  		if(resp && resp.ok === true){
	  			this.user = resp;
	  			this.dismiss();
	  		}
	  		else {
	  			this.error = resp.message||"Failed to register";
	  		}
	  	}, ()=>{
	  		this.error = "Failed to register";
	  	});

	}

	dismiss(){
	  	//this.close.emit(this.user);
	}

}
