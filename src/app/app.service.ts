import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
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

const httpOptions = {
  withCredentials: true
};


@Injectable()
export class AppService {
	
	user: any = null;
	sessionStorage: any = sessionStorage || window.sessionStorage;

	constructor(
		private http: HttpClient) {

		if( this.sessionStorage.getItem("user") ){
			this.user = JSON.parse(this.sessionStorage.getItem("user"));
			AppConstants.Token.set(this.user.csrfToken);
		}
	}

	getUser(): any{
		return this.user;
	}

	logout(): any{
		this.user = null;
		AppConstants.Token.set(null);
		this.sessionStorage.removeItem("user");
	}

	register(data: any){
		return this.http.post(AppConstants.API2_URL + 'auth/register', data, httpOptions)
	}

	login(data: any){
		return this.http.post(AppConstants.API2_URL + 'auth/login', data, httpOptions)
		.map((resp:any) => {
			this.user = resp.data;
			this.sessionStorage.setItem("user", JSON.stringify(this.user));
			AppConstants.Token.set(this.user.csrfToken);
			return resp;
		});
	}

	verifyUser(key: string): Observable<any>{
		return this.http.post(AppConstants.API2_URL + 'auth/verifyUser?vid='+ key, {}, httpOptions)
	}

	validateLogin(data: any){
		return this.http.post(AppConstants.API2_URL + 'validateLogin', data, httpOptions)
		.map((resp:any) => {
			this.user = resp;
			return this.user;
		});
	}

	updateUserDetails(data: any){
		return this.http.post(AppConstants.API2_URL + 'auth/updateUserDetails', data, httpOptions)
	}

	sendResetPassword(data: any){
		return this.http.post(AppConstants.API2_URL + 'auth/sendResetPasswordVerificationEmail', data, httpOptions)
	}

	verifyResetPassword(key: string): Observable<any>{
		return this.http.post(AppConstants.API2_URL + 'auth/verifyResetPassword?vid='+ key, {}, httpOptions)
	}

	resetPassword(data: any){
		return this.http.post(AppConstants.API2_URL + 'auth/resetPassword', data, httpOptions)
	}

	getERC20Balance(){
		return this.http.post(AppConstants.API2_URL + 'rest/block/getERC20Balance', {}, httpOptions)
	}

	getEthBalance(){
		return this.http.post(AppConstants.API2_URL + 'rest/block/getEthBalance', {}, httpOptions)
	}

	getUsers(){
		return this.http.post(AppConstants.API2_URL + 'rest/user/getUsers', {}, httpOptions)
	}

	/*balance(data: any){
		return this.http.post(AppConstants.API2_URL + 'balance', data)
		.map((resp) => resp.json() );
	}*/

	locationsNearMe(data: any){
		return this.http.post(AppConstants.API2_URL + 'locations-near-me', data)
	}

	getGeoCoding(strAddress: string){
		return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ encodeURIComponent(strAddress) +'&key='+ AppConstants.GoogleApiKey)
	}

	getDepositAddress() {
		return this.http.post(AppConstants.API2_URL + 'rest/user/getUserAddresses', {}, httpOptions);
	}

	transfer(data: any) {
		let url = "";
		if(data.addressType === 'ERC20'){
			url = 'rest/block/transferERC20';
		} else if(data.addressType === 'Ether'){
			url = 'rest/block/transferEther';
		}
		return this.http.post(AppConstants.API2_URL + url, data, httpOptions);
	}
}
