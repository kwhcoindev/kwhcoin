import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AppService } from '../app.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import * as zxcvbn from "zxcvbn";

/**
 * Custom validator functions for reactive form validation
 */
export class CustomValidators {
    /**
     * Validates that child controls in the form group are equal
     */
    static childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
        const [firstControlName, ...otherControlNames] = Object.keys(formGroup.controls || {});
        const isValid = otherControlNames.every(controlName => formGroup.get(controlName).value === formGroup.get(firstControlName).value);
        return isValid ? null : { childrenNotEqual: true };
    }
}


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() user: any = null;
  inputForm: FormGroup;
  error: string = null;
  success: boolean = false;
  emailId: string = null;
  loading: boolean = false;

  barColors: Array<string> = [];
  colors: Array<string> = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];
  passwordStrength: number = 0;  

  constructor(private service: AppService, private fb: FormBuilder, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
  	this.emailId = null;
  	this.inputForm = this.fb.group({
  		firstName: ['', Validators.required],
  		lastName: ['', Validators.required],
      passwordGroup: this.fb.group({
            pswd: ['', [
                Validators.required
            ]],
            rePswd: ['', Validators.required]}, 
        { validator: CustomValidators.childrenEqual}),      
        emailId: ['', [
            Validators.required,
            Validators.email
        ]]
	   });

     this.updateBarColors("");
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

  register(content){
    	//this.router.navigate(['verify/'+ (new Date()).getTime()]);
    	//this.dismiss();

  	if(this.inputForm.invalid === true)
  		return;

  	this.user = null;
  	this.error = null;
  	this.success = false;
  	this.loading = true;

    let data = {
      firstName: this.inputForm.value.firstName,
      lastName: this.inputForm.value.lastName,
      emailId: this.inputForm.value.emailId,
      pswd: this.inputForm.value.passwordGroup.pswd,
      rePswd: this.inputForm.value.passwordGroup.rePswd
    };

  	this.service.register(data)
  	.subscribe((resp:any)=>{
  		this.loading = false;
  		if(resp.status == "SUCCESS"){
  			this.success = true;
  			this.dismiss();
  			this.showMessage(content);
  		}
  		else {
  			this.error = resp.errorDesc||"Failed to register, kindly try after sometime";
  			this.showMessage(content);
  		}
  	}, (resp)=>{
  		this.loading = false;
  		this.error = "Failed to register, kindly try after sometime";
  		this.showMessage(content);
  	});

  }

  showMessage(content){
	this.emailId = this.inputForm.value.emailId;
	this.inputForm.value.emailId = "";
	this.inputForm.value.firstName = "";
	this.inputForm.value.lastName = "";
	this.modalService.open(content, {size: 'lg'})
		.result.then((result) => {
	}, (reason) => {
	});  
  }

  dismiss(){
  	this.close.emit(this.user);
  }

}
