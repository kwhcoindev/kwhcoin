import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AppService } from '../app.service';


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

  //@Output() close: EventEmitter<any> = new EventEmitter();
  @Input() user: any = null;
  inputForm: FormGroup;
  error: string = null;

  constructor(private service: AppService, private fb: FormBuilder) { }

  ngOnInit() {
  	this.inputForm = this.fb.group({
	  name: ['', Validators.required ],
	  emailGroup: this.fb.group({
            email: ['', [
                Validators.required,
                Validators.email
            ]],
            confirmEmail: ['', Validators.required]}, 
        { validator: CustomValidators.childrenEqual}),
	  //email: ['', [Validators.required, Validators.email] ],
	  //confirmEmail: ['', [Validators.required, Validators.confirmEmail] ],
	  //password: ['', Validators.required ],
	  //confirmPassword: ['', Validators.required ],
	  street1: ['', Validators.required ],
	  street2: ['', null ],
	  city: ['', null ],
	  zip: ['', null ],
	  state: ['', null ],
	  county: ['', null ],
	  country: ['', Validators.required ]
	});

  }


  typeHere(p){
  	console.log(p);
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
