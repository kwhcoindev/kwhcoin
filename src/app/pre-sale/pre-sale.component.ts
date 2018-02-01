import { Component, OnInit } from '@angular/core';

declare var jQuery;

@Component({
  selector: 'app-pre-sale',
  templateUrl: './pre-sale.component.html',
  styleUrls: ['./pre-sale.component.scss']
})
export class PreSaleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	jQuery('#coin_widget').html('<div class="cmw-widget-icocoin" data-ticker="KWH" style="font-size:16px;max-width:310px;min-width:310px"></div><script type="text/javascript" src="https://www.coinmarketwatch.com/assets/scripts/ico-widget.min.js"></script>');
  }

}
