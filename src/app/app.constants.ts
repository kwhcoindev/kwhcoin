export class AppConstants {
	public static API_URL: string = document.location.hostname.indexOf('kwhcoin.com') != -1? 'https://api.kwhcoin.com/' : 'http://dev.coinmarketwatch.com/kwh/';
}