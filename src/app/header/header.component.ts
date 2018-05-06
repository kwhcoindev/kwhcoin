import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {

	@Input() navIsFixed : boolean = false;
  user: any = null;
  signInUrl: string = (document.location.hostname.indexOf('localhost')!= -1? "/#/signin" : "https://app.kwhcoin.com/#/signin" );

  isOpenSignInUp: boolean = false;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(args){
  	this.navIsFixed = args.navIsFixed.currentValue;
  }

  toggleSignInUp(){
    this.isOpenSignInUp = !this.isOpenSignInUp;
  }

  closeSignInUp(user){
  console.log("close sign up", user);
    if(typeof user !== 'undefined'){
      this.user = user;
    }
    this.isOpenSignInUp = false;
  }

}
