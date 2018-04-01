import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { NgbDatepickerConfig, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../app.constants';

import * as moment from 'moment';


@Component({
  selector: 'app-join-us',
  templateUrl: './join-us.component.html',
  styleUrls: ['./join-us.component.scss']
})
export class JoinUsComponent implements OnInit {

    joinusForm: FormGroup;
    status: number;
    message: string;
    tokens: Array<any> = [];
    submitted: boolean = false;

	constructor(private fb: FormBuilder, private http: Http) { }

  	ngOnInit() {
  		this.reset();
  	}

  	reset(){
	  this.submitted = false;
      this.joinusForm = this.fb.group({
	      name:  ['', Validators.required ],
	  	  email: ['', [Validators.required, Validators.email] ],
	  	  city_state: ['', Validators.required ],
	  	  country: ['', Validators.required ],
	  	  type_of_project: ['', Validators.required ],
	  	  project_desc: ['', Validators.required ],
	  	  how_did_you_hear_about_us: ['', Validators.required ],
	  	  organized_meet_up: [null, null ]
      });

  	}

  	onSubmit() {
  		this.submitted = true;
		if( this.joinusForm.pristine || this.joinusForm.invalid )
			return;

		this.http.post(AppConstants.API_URL + 'service/join-us.php', this.joinusForm.value)
		.subscribe((resp)=>{
			let data = resp.json();
			this.status = data.status;
			this.message = data.message;
			if( this.status == 200 ){
			  this.reset();
			}
		},()=>{
			this.status = 500;
			this.message = "Failed to submit the information, please try after sometime";
		});

  	}


}
