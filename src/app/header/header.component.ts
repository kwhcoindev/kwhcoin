import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {

	@Input() navIsFixed : boolean = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(args){
  	this.navIsFixed = args.navIsFixed.currentValue;
  }

}
