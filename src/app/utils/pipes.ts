import { Pipe, PipeTransform } from '@angular/core';
import {CurrencyPipe, DecimalPipe, PercentPipe} from '@angular/common'; 

import * as moment from 'moment';


@Pipe({name: 'currencySymbol'})
export class CurrencySymbolPipe implements PipeTransform {
  
  transform(value: any): any {
	value = value.replace('BTC','<i class="fa fa-btc"></i>');
    return value;
  }
}

@Pipe({name: 'timeFormat'})
export class TimeFormatPipe implements PipeTransform {
  
  transform(date: any): any {
    var otherDates = moment(date).fromNow();
    var calback = function() {
        return '['+otherDates+']';
    }
    return moment(date).calendar(null,{
         sameDay: calback,
         nextDay: 'MMM DD, YYYY',
         nextWeek: 'MMM DD, YYYY',
         lastDay: 'MMM DD, YYYY',
         lastWeek: 'MMM DD, YYYY',
         sameElse: 'MMM DD, YYYY'
    });
  }
}

@Pipe({name: 'icdc'})
export class IcdcPipe extends CurrencyPipe implements PipeTransform {
  
  transform(value: any, currencyCode?: string, symbolDisplay?: boolean, digits?: string): any {
    if (!value) return '-';
  	let retVal = super.transform(value, currencyCode, symbolDisplay, Math.abs(value)<1? '1.0-8': digits);
	if(currencyCode=='BTC' && symbolDisplay===true) retVal = retVal.replace('BTC','<i class="fa fa-btc m-r-2"></i>');
    return retVal;
  }
}

@Pipe({name: 'icdcChange'})
export class IcdcChangePipe extends CurrencyPipe implements PipeTransform {
  
  transform(value: any, currencyCode?: string, symbolDisplay?: boolean, digits?: string): any {
    if (!value||value==0) return '-';

    let retVal = super.transform(value, currencyCode, symbolDisplay, Math.abs(value)<1? '1.0-8': digits);
  if(currencyCode=='BTC' && symbolDisplay===true) retVal = retVal.replace('BTC','<i class="fa fa-btc m-r-2"></i>');
    return value>0? '+' + retVal : retVal;
  }
}

@Pipe({name: 'icdcPct'})
export class IcdcPctPipe extends PercentPipe implements PipeTransform {

  	transform(value: any, digits: string): any {
	    if (!value||value==0) return '-';

	  	let retPct = super.transform(value/100, Math.abs(value)<1? '1.0-4': digits);

	    return (value>0? '+' + retPct : retPct);
	}
}

@Pipe({name: 'largeCurrency'})
export class LargeCurrencyPipe extends CurrencyPipe implements PipeTransform {
  
  transform(value: any, currencyCode?: string, symbolDisplay?: boolean, digits?: string): any {
    if (!value||value==0) return '-';
    let postFix = '';
    /*if(value > 1000000000000) {//Trillions
    	value = value/1000000000000;
    	postFix = 'T'
    }
    else */
    if(value > 1000000000) {//Billions
    	value = value/1000000000;
    	postFix = 'B'
    }
    else
    if(value > 1000000) {//Millions
    	value = value/1000000;
    	postFix = 'M'
    }
  	let retVal = super.transform(value, currencyCode, symbolDisplay, postFix!=''? '1.0-2': (Math.abs(value)<1? '1.0-8': digits));
  	if(currencyCode=='BTC' && symbolDisplay===true) retVal = retVal.replace('BTC','<i class="fa fa-btc m-r-2"></i>');
    return retVal + postFix;
  }
}

@Pipe({name: 'mediumCurrency'})
export class MediumCurrencyPipe extends CurrencyPipe implements PipeTransform {
  
  transform(value: any, currencyCode?: string, symbolDisplay?: boolean, digits?: string): any {
    if (!value||value==0) return '-';
    let postFix = '';
    /*if(value > 1000000000000) {//Trillions
      value = value/1000000000000;
      postFix = 'T'
    }
    else
    if(value > 1000000000) {//Billions
      value = value/1000000000;
      postFix = 'B'
    }
    else*/
    if(value > 1000000) {//Millions
      value = value/1000000;
      postFix = 'M'
    }
    let retVal = super.transform(value, currencyCode, symbolDisplay, postFix!=''? '1.0-2': (Math.abs(value)<1? '1.0-8': digits));
    if(currencyCode=='BTC' && symbolDisplay===true) retVal = retVal.replace('BTC','<i class="fa fa-btc m-r-2"></i>');
    return retVal + postFix;
  }
}

@Pipe({name: 'largeNumber'})
export class LargeNumberPipe extends DecimalPipe implements PipeTransform {
  
  transform(value: any, digits?: string): any {
    if (!value||value==0) return '-';
    let postFix = '';
    /*if(value > 1000000000000) {//Trillions
      value = value/1000000000000;
      postFix = 'T'
    }
    else */
    if(value > 1000000000) {//Billions
      value = value/1000000000;
      postFix = 'B'
    }
    else
    if(value > 1000000) {//Millions
      value = value/1000000;
      postFix = 'M'
    }
    let retVal = super.transform(value, postFix!=''? '1.0-2': (Math.abs(value)<1? '1.0-8': digits));
    return retVal + postFix;
  }
}
