import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { NgbDatepickerConfig, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../app.constants';

import * as moment from 'moment';


@Component({
  selector: 'app-know-your-customer',
  templateUrl: './know-your-customer.component.html',
  styleUrls: ['./know-your-customer.component.scss']
})
export class KnowYourCustomerComponent implements OnInit {

    kycForm: FormGroup;
    status: number = 200;
    message: string;
    tokens: Array<any> = [{code_desc:"ICO Token Address", code_value:"0xebc7cd2684dd96619841c7994343c5a8bda94b10"}, {code_desc:"Advanced Data Field for My EtherWallet", code_value:"0xb4427263"}];

	constructor(private fb: FormBuilder, private http: Http, private config: NgbDatepickerConfig ) { }

	ngOnInit() {

		this.config.minDate = {
			day: 1,
			month: 1,
			year: 1900
		};

      this.kycForm = this.fb.group({
      ipromise:  [false, Validators.required ],
  	  first_name: ['', Validators.required ],
  	  last_name: ['', Validators.required ],
  	  street: ['', Validators.required ],
  	  city: ['', Validators.required ],
  	  zip: ['', Validators.required ],
  	  country: ['', Validators.required ],
  	  dob: ['', Validators.required ]
      });
	}

	formatter = (dt) => dt.month +"/" + dt.day +"/" + dt.year;

  	onSubmit() {
  		if(!this.kycForm.pristine && !this.kycForm.invalid){

  			this.http.post(AppConstants.API_URL + 'service/kyc-form.php', {
  				first_name: this.kycForm.value.first_name,
  				last_name: this.kycForm.value.last_name,
  				dob_day: this.kycForm.value.dob.day,
  				dob_month: this.kycForm.value.dob.month,
  				dob_year: this.kycForm.value.dob.year,
  				street: this.kycForm.value.street,
  				city: this.kycForm.value.city,
  				zip: this.kycForm.value.zip,
  				country: this.kycForm.value.country
  			})
  			.subscribe((resp)=>{
  				let data = resp.json();
  				this.status = data.status;
  				this.message = data.message;
  				this.tokens = data.tokens;
  			},()=>{
  				this.status = 500;
  				this.message = "Failed to submit the information, please try after sometime";
  			})

  		}
  	}  

}
