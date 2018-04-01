import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { AppConstants } from '../app.constants';

declare var document;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

    contactusForm: FormGroup;
    status: number;
    message: string;
    submitted: boolean = true;
    apiUrl: string = AppConstants.API_URL;

  	constructor(private fb: FormBuilder, private route: ActivatedRoute, private http: Http) { }

  	ngOnInit() {
      this.reset();
  	}

    reset() {
      this.submitted = false;
      this.contactusForm = this.fb.group({
        name: ['', Validators.required ],
        email: ['', [Validators.required, Validators.email] ],
        message: ['', Validators.required ]
      });    
    }

  	onSubmit() {
      this.submitted = true;
  		if(!this.contactusForm.pristine && !this.contactusForm.invalid){
  			if(this.contactusForm.value.message.length <= 4000){

          this.http.post(this.apiUrl + 'service/contact-us.php', {
            name: this.contactusForm.value.name,
            email: this.contactusForm.value.email,
            message: this.contactusForm.value.message
          })
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
        else{
          console.log("greater than 4000");
        }

  		} else {
        console.log("invalid form");
      }
  	}
}
