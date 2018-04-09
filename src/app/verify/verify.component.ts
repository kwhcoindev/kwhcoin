import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AppService } from '../app.service';
import { CustomValidators } from '../signup/signup.component';

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
	error: string = null;

	barColors: Array<string> = [];
	colors: Array<string> = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];
	passwordStrength: number = 0;


  	constructor(private service: AppService, private fb: FormBuilder) { }

	ngOnInit() {

		this.updateBarColors("");

		this.inputForm = this.fb.group({
		  name: ['', Validators.required ],
		  passwordGroup: this.fb.group({
		        password: ['', [
		            Validators.required
		        ]],
		        confirmPassword: ['', Validators.required]}, 
		    { validator: CustomValidators.childrenEqual}),
		  street1: ['', Validators.required ],
		  street2: ['', null ],
		  city: ['', null ],
		  zip: ['', null ],
		  state: ['', null ],
		  county: ['', null ],
		  country: ['', Validators.required ],
		  latitude: ['', null],
		  longitude: ['', null]
		});

	}

	updateBarColors(color): void {
		this.barColors = [];
		for (let i = 0; i < 5; i++) {
			this.barColors.push((i <= this.passwordStrength) ? color : '');
		}
	}

	updatePasswordStrength(): void {
		let results = zxcvbn(this.inputForm.controls.passwordGroup.value.password);
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

	  	this.service.getGeoCoding( this.formatAddress(this.inputForm.value) )
	  	.subscribe((resp)=>{

			let data = this.inputForm.value;

	  		if(resp.results && resp.results.length>0){
	  			let address = resp.results[0];
	  			resp.results.forEach( (o)=>{
	  				if(o.geometry.location_type == 'ROOFTOP'){
	  					address = o;
	  					if( address.geometry && address.geometry.location ){
				  			data.latitude = address.geometry.location.lat;
				  			data.latitude = address.geometry.location.lng;
				  		}
	  					return false;
	  				}
	  			});

			  	this.service.verify(data)
			  	.subscribe((resp)=>{
			  		if(resp && resp.ok === true){
			  			this.user = resp;
			  			this.dismiss();
			  		}
			  		else {
			  			this.error = resp.message||"Failed to update profile";
			  		}
			  	}, ()=>{
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
