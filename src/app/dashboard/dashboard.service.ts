import { Injectable } from '@angular/core';


@Injectable()
export class DashboardService {
	
	user: any = null;
	users: Array<any> = null;

	constructor() {

	}

	getUser(): any{
		return this.user;
	}

	getUsers(): Array<any>{
		return this.users;
	}

	setUser(user: any){
		this.user = user;
	}

	setUsers(users: Array<any>){
		this.users = users;
	}

}
