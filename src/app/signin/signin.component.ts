import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';


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

  constructor(private service: AppService, private fb: FormBuilder) { }

  ngOnInit() {
  	this.inputForm = this.fb.group({
	  username: ['', [Validators.required, Validators.email] ],
	  password: ['', Validators.required ]
	});

  }

  login(){
  console.log(this.inputForm)
  	if(this.inputForm.invalid === true)
  		return;

  	this.user = null;
  	this.error = null;

  	this.service.login(this.inputForm.value)
  	.subscribe((resp)=>{
  		if(resp && resp.token){
  			this.user = resp;
  			this.dismiss();
  		}
  		else {
  			this.error = resp.message||"Failed to login";
  		}
  	}, (resp)=>{
  		resp = resp.json();
  		this.error = resp.message||"Failed to login";
  	});

  }

  dismiss(){
  	this.close.emit(this.user);
  }
}
