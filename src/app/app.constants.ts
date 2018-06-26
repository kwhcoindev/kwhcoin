export class AppConstants {
	public static API_URL: string = document.location.hostname.indexOf('kwhcoin.com') != -1? 'https://api.kwhcoin.com/' : 'http://dev.coinmarketwatch.com/kwh/';

	public static API2_URL: string = document.location.hostname.indexOf('kwhcoin.com') != -1? 'https://api2.kwhcoin.com/' : 'http://35.170.160.153:8080/ico/';

	public static GoogleApiKey: string = "AIzaSyDGoLvy6GqPjkjDSx-XWsvp2gwy6gKRAcs";

	public static Authorization: string = 'bcb66df33fbeec02931c0f99d84a3502b1146f3a';

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