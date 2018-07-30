import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ViewChild, TemplateRef } from '@angular/core';
import { } from '@types/googlemaps';
import { AppService } from '../../app.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DashboardService } from '../dashboard.service';


@Component({
  selector: 'dashboard-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

	user: any = null;
	users: Array<any> = null;

	@ViewChild('gmap') gmapElement: any;
  	map: google.maps.Map;

  	@ViewChild('emailContent')
    private emailContentRef : TemplateRef<any>;

    markers: Array<any> = [];
    contact: any = null;

	emailForm: FormGroup;
	success: string;
	error: string = null;
	loading: boolean = false;


	constructor(private service: AppService, private dashService: DashboardService, private modalService: NgbModal, private fb: FormBuilder) { }

	ngOnInit() {

		this.users = this.dashService.getUsers();
		this.user = this.dashService.getUser();
		
		this.renderGoogleMap(this.users);

	  	this.emailForm = this.fb.group({
	  		userId: [''],
		  	subject: ['', [Validators.required, Validators.maxLength(200)] ],
		  	message: ['', [Validators.required, Validators.maxLength(4000)] ]
		  });

	}

	@HostListener('click', ['$event'])
	onClickEvent(ev:any) {
	    // do something meaningful with it
	    let cls = ev.target.className||"";
	    if( cls.indexOf('open-send-email') != -1 ){
	    	let idx = +ev.target.getAttribute('data-index');
	    	//console.log("Found element" + idx);
	    	this.openSendEmail(idx);
	    }
	}

	openSendEmail(idx: number){
		this.contact = this.markers[idx][0];
		this.loading = false;
		//console.log(this.contact);
	    this.modalService.open(this.emailContentRef, {size: 'lg'}).result
	    .then((result) => {
	    }, (reason) => {
	    });
	}

	sendEmail(d) {
		if(this.emailForm.invalid){
			return;
		}

		let data = this.emailForm.value;
		data.userId = this.contact.uid;

		this.loading = true;
		this.service.sendEmail(data)
	  	.subscribe((resp:any)=>{
	  		this.loading = false;
	  		if(resp.status == "SUCCESS"){
	  			d();
	  		}
	  		else {
	  			this.error = resp.errorDesc||"Oops! something went wrong while sending email.";
	  		}
	  	}, ()=>{
	  		this.loading = false;
	  		this.error = "Oops! something went wrong, please contact support";
	  	});
	}

	renderGoogleMap(list: Array<any>){
		let bounds = new google.maps.LatLngBounds();
	    let mapProp = {
	      center: new google.maps.LatLng(+this.user.latitude||0, +this.user.longitude||0),
	      zoom: 13,
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      markers: [
	      ]
	    };
	    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

	    // Multiple markers location, latitude, and longitude
	    this.markers = [];
	    list.forEach((o)=>{
	    	if(o.longitude && o.latitude)
	    		this.markers.push([ o, +o.latitude, +o.longitude ])
	    });

	    /*[
	        ['Brooklyn Museum, NY', 40.671531, -73.963588],
	        ['Brooklyn Public Library, NY', 40.672587, -73.968146],
	        ['Prospect Park Zoo, NY', 40.665588, -73.965336]
	    ];*/

		let infoWindow = new google.maps.InfoWindow(), marker, i;

	    this.markers.forEach((m: Array<any>, idx)=>{
			let position = new google.maps.LatLng(m[1], m[2]);
        	//bounds.extend(position);

	        marker = new google.maps.Marker({
	          map: this.map,
	          draggable: true,
	          animation: google.maps.Animation.DROP,
	          position: position
	        });

			// Add info window to marker    
	        google.maps.event.addListener(marker, 'click', ((marker, i)=>{
	            return ()=>{
	                infoWindow.setContent('<div id="content">'+
					            '<div id="siteNotice">'+
					            '</div>'+
					            '<div><strong id="firstHeading" class="firstHeading">'+ (m[0].firstName||'') + ' ' + (m[0].lastName||'') +'</strong></div>'
					            +'<br /><a href="javascript:;" class="open-send-email" data-index="'+ idx +'"><i class="fa fa-envelope-o mr-1"></i>Send email</a>'
					            +'</div>');
	                infoWindow.open(this.map, marker);
	                console.log(infoWindow);
	            }
	        })(marker, i));

	        // Center the map to fit all markers on the screen
	        //this.map.fitBounds(bounds);

	    });
	    //console.log(this.markers);

	}

}
