export class AppConstants {
	public static API_URL: string = document.location.hostname.indexOf('kwhcoin.com') != -1? 'https://api.kwhcoin.com/' : 'http://dev.coinmarketwatch.com/kwh/';

	public static API2_URL: string = "http://35.170.160.153:9000/";
}