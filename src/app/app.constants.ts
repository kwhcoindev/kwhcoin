export class AppConstants {
	public static API_URL: string = document.location.hostname.indexOf('APP_DOMAIN') != -1? 'APP_API_URL_PROD' : 'APP_API_URL_DEV';

	public static API2_URL: string = document.location.hostname.indexOf('APP_DOMAIN') != -1? 'APP_API2_URL_PROD' : 'APP_API2_URL_DEV';

	public static GoogleApiKey: string = "KWH_GOOGLE_API_KEY";

	public static Authorization: string = "KWH_APP_API_KEY";

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