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
  email: string = null;
  loading: boolean = false;

  constructor(private service: AppService, private fb: FormBuilder, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
  	this.email = null;
  	this.inputForm = this.fb.group({
        email: ['', [
            Validators.required,
            Validators.email
        ]]
	});
  }

  register(content){
    	this.router.navigate(['verify/'+ (new Date()).getTime()]);
    	this.dismiss();

/*  	if(this.inputForm.invalid === true)
  		return;

  	this.user = null;
  	this.error = null;
  	this.loading = true;

  	this.service.register(this.inputForm.value)
  	.subscribe((resp)=>{
  		this.loading = false;
  		if(resp == 200){
  			this.user = resp;
  			this.dismiss();
  			this.email = this.inputForm.value.email;
  			this.inputForm.value.email = "";
  			this.modalService.open(content, {size: 'lg'})
  			.result.then((result) => {
		    }, (reason) => {
		    });
  		}
  		else {
  			this.error = resp.message||"Failed to register";
  		}
  	}, (resp)=>{
  		this.loading = false;
  		resp = resp.json();
  		console.log("error error ", resp);
  		this.error = resp.message||"Failed to register";
  	});*/

  }

  dismiss(){
  	this.close.emit(this.user);
  }

}
