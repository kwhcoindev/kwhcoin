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
  loading: boolean = false;

  constructor(private service: AppService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
  	this.inputForm = this.fb.group({
	  emailId: ['', [Validators.required, Validators.email] ],
	  pswd: ['', null ]
	});

	this.user = this.service.getUser();
	if(this.user && this.user.emailId)
		this.router.navigate(['dashboard/summary']);
  }

  login(){

  	if(this.inputForm.invalid === true)
  		return;

  	this.user = null;
  	this.error = null;
    this.loading = true;

  	this.service.login(this.inputForm.value)
  	.subscribe((resp)=>{
        this.loading = false;
  		if(resp.status == "SUCCESS" && resp.data && resp.data.emailId){
		  	this.router.navigate(['dashboard/summary']);
  			this.dismiss();
  		}
  		else {
  			this.error = resp.errorDesc||"Login failed. Email/Password is invalid";
  		}
  	}, ()=>{
        this.loading = false;
  		this.error = "Oops! something went wrong, please contact support";
  	});

  }

  dismiss(){
  	this.close.emit(this.user);
  }
}
