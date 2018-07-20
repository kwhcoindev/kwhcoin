import { Component, OnInit, Input } from '@angular/core';
import { ViewChild, TemplateRef } from '@angular/core';
import { } from '@types/googlemaps';
import { AppService } from '../../app.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'dashboard-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

	@Input() user: any = null;
	@Input() users: Array<any> = null;

	@ViewChild('gmap') gmapElement: any;
  	map: google.maps.Map;

  	@ViewChild('emailContent')
    private emailContentRef : TemplateRef<any>;

    markers: Array<any> = [];
    contact: any = null;

	emailForm: FormGroup;
	error: string = null;
	loading: boolean = false;


	constructor(private service: AppService, private modalService: NgbModal, private fb: FormBuilder) { }

	ngOnInit() {

		this.renderGoogleMap(this.users);

	  	this.emailForm = this.fb.group({
	  		userId: [''],
		  	subject: ['', [Validators.required, Validators.maxLength(200)] ],
		  	message: ['', [Validators.required, Validators.maxLength(4000)] ]
		  });

	}

	openSendEmail(idx: number){
		this.contact = this.markers[idx];
		console.log(this.contact);
	    this.modalService.open(this.emailContentRef, {size: 'lg'}).result
	    .then((result) => {
	    }, (reason) => {
	    });
	}

	sendEmail() {
		if(this.emailForm.invalid){
			return;
		}

		let data = this.emailForm.value;
		data.userId = this.contact.uid;

		console.log(data);
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
					            +'<a href="javascript:;" (click)="openSendEmail('+ idx +')">Contact member</a>'
					            +'</div>');
	                infoWindow.open(this.map, marker);
	            }
	        })(marker, i));

	        // Center the map to fit all markers on the screen
	        //this.map.fitBounds(bounds);

	    })

	}

}
