import { Component, OnInit, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'dashboard-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

	@Input() user: any = null;
	@Input() wallet: any = null;

	@ViewChild('gmap') gmapElement: any;
  	map: google.maps.Map;

	constructor() { }

	ngOnInit() {
		let bounds = new google.maps.LatLngBounds();

	    let mapProp = {
	      center: new google.maps.LatLng(40.7322535, -73.98741050000001),
	      zoom: 5,
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      markers: [
	      ]
	    };
	    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

	    // Multiple markers location, latitude, and longitude
	    let markers = [
	        ['Brooklyn Museum, NY', 40.671531, -73.963588],
	        ['Brooklyn Public Library, NY', 40.672587, -73.968146],
	        ['Prospect Park Zoo, NY', 40.665588, -73.965336]
	    ];

		let infoWindow = new google.maps.InfoWindow(), marker, i;

	    markers.forEach((m: Array<any>)=>{
			let position = new google.maps.LatLng(m[1], m[2]);
        	bounds.extend(position);

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
					            '<strong id="firstHeading" class="firstHeading">'+ m[0] +'</strong>'+
					            '</div>');
	                infoWindow.open(this.map, marker);
	            }
	        })(marker, i));

	        // Center the map to fit all markers on the screen
	        this.map.fitBounds(bounds);

	    })
	}

}
