import { environment } from '../environments/environment';

export class AppConstants {
	public static API_URL: string = environment.APP_API_URL;

	public static API2_URL: string = environment.APP_API2_URL;

	public static GoogleApiKey: string = environment.APP_GOOGLE_API_KEY;

	public static Authorization: string = environment.APP_API_KEY;

	public static Token: any = (()=>{
		let token = null;
		return {
			get: ()=>{
				return token;
			},
			set: (t: string)=>{
				token = t;
			}
		}
	})()
}