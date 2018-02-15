import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AppConstants } from "../app.constants";

declare var window;

@Component({
  selector: 'app-kyc-form2',
  templateUrl: './kyc-form2.component.html',
  styleUrls: ['./kyc-form2.component.scss']
})
export class KycForm2Component implements OnInit {

	token: string;
	jsLib: string;

  	constructor(private http: HttpClient) {
    }

	ngOnInit() {
//        const headers = new HttpHeaders({"x-api-key": "11GctO12uL9QeEtgFkcSe50BbuGwtFVY41GyZJpg"});
		//headers.append('x-api-key', this.config.apiKey);
		//headers.append('X-Frame-Options', 'SAMEORIGIN');

//        const options = {headers: headers};

		this.http.get(AppConstants.API_URL + "service/kyc-service.php?getToken")
		.subscribe((resp: any)=>{
			this.token = resp.token;
			this.jsLib = resp.jsLib;

			this.createObject();
		});

	}

	createObject(){
        window["_idm"] = {
            container_id: "idm_container",
            plugin_token: this.token,
            on_response: (jwtresponse)=>{
                const array = jwtresponse.split('.');
                const header = JSON.parse(atob(array[0]));
                const response = JSON.parse(atob(array[1]));
                const signature = array[2];
                const xhr = new XMLHttpRequest();
                const url = AppConstants.API_URL + "service/kyc-service.php?validate";
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.onreadystatechange = ()=> {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        // response validated
                        alert("Response from Identitymind is valid.  Result: " + response.kyc_result);
                   }
                };
                xhr.send(jwtresponse);
            }
        };

    	let es = document.getElementById("idm_script");
    	if( es ){
    		es.parentNode.removeChild(es);
    	}
        var e=document.createElement('script');
        e.src = this.jsLib + '?_'+ (new Date()).getTime();
        e.setAttribute("id","idm_script");
        document.body.appendChild(e);

	}

}
