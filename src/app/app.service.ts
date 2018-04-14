import { Injectable, EventEmitter } from '@angular/core';
import { Jsonp, Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import { AppConstants } from './app.constants';

import * as moment from 'moment';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';



export class DataObservable {

	private data: any;
	private subscribers: any = {};
	private counter: number = 1;

	notify(): void {
		for(let key in this.subscribers) {
			try{
            	this.subscribers[key](this.data);
            }catch(e){}
        }
	}

	public next(pData: any): void {
      	this.data = pData;
      	this.notify();
    }

    public observer(): any {
	    return {
			subscribe: (handler) => {
				let c = 's_'+ this.counter++;
				this.subscribers[c] = handler;

				if(handler && typeof handler == 'function' && this.data){
					try{
						handler(this.data);
					}catch(e){}
				}

				return {unsubscribe: ()=>{ delete this.subscribers[c]; } };
			}
		};
	};
}


@Injectable()
export class EmitterService {
    // Event store
    private static _emitters: { [ID: string]: EventEmitter<any> } = {};
    // Set a new event in the store with a given ID
    // as key
    static get(ID: string): EventEmitter<any> {
        if (!this._emitters[ID])
            this._emitters[ID] = new EventEmitter();
        return this._emitters[ID];
    }
}

@Injectable()
export class AppService {
	
	user: any = null;

	constructor(
		private http: Http,
		private jsonp: Jsonp) {

	}

	getUser(): any{
		return this.user;
	}

	register(data: any){
		return this.http.post(AppConstants.API2_URL + 'register', data)
		.map((resp) => resp.json() );
	}

	login(data: any){
		return this.http.post(AppConstants.API2_URL + 'login', data)
		.map((resp) => {
			this.user = resp.json();
			return this.user;
		});
	}

	validateLogin(data: any){
		return this.http.post(AppConstants.API2_URL + 'validateLogin', data)
		.map((resp) => {
			this.user = resp.json();
			return this.user;
		});
	}

	verify(data: any){
		return this.http.post(AppConstants.API2_URL + 'verify', data)
		.map((resp) => resp.json() );
	}

	balance(data: any){
		return this.http.post(AppConstants.API2_URL + 'balance', data)
		.map((resp) => resp.json() );
	}

	locationsNearMe(data: any){
		return this.http.post(AppConstants.API2_URL + 'locations-near-me', data)
		.map((resp) => resp.json() );
	}

	getGeoCoding(strAddress: string){
		return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ encodeURIComponent(strAddress) +'&key='+ AppConstants.GoogleApiKey)
		.map((resp)=>resp.json());
	}
}
