import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AppService } from '../app.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


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

  constructor(private service: AppService, private fb: FormBuilder, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
  	this.emailId = null;
  	this.inputForm = this.fb.group({
  		firstName: ['', Validators.required],
  		lastName: ['', Validators.required],
        emailId: ['', [
            Validators.required,
            Validators.email
        ]]
	});
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

  	this.service.register(this.inputForm.value)
  	.subscribe((resp:any)=>{
  		this.loading = false;
  		if(resp.status == "SUCCESS"){
  			//this.router.navigate(['verifyUser', { queryParams: {'vid': 'd35897ad-60e5-42eb-a4a8-7d86ed902634'} }]);
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
