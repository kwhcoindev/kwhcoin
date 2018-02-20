import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Http } from '@angular/http';

import * as moment from 'moment';

declare var Highcharts;
declare var jQuery;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    date = "02-08-2018 20:00:00+00:00";
    dateStr = moment(this.date, "MM-DD-YYYY hh:mm:ssZ").format("MMMM Do");

    status: number;
    message: string;
    public trackForm: FormGroup;
    public trackCoinData: any;

  	constructor(private fb: FormBuilder, private http: Http, private modalService: NgbModal) { }

  	ngOnInit() {
	  	jQuery('#coin_widget').html('<div class="cmw-widget-icocoin" data-ticker="KWH" style="font-size:18px;max-width:320px;min-width:320px"></div><script type="text/javascript" src="assets/js/ico-widget.js?_'+ (new Date()).getTime() +'"></script>');

      this.trackForm = this.fb.group({
        address: ['', Validators.required ]
      });

      //this.getChartData();
      this.renderChart();

  	}

    openTrackModal(content){
      this.trackCoinData = null;
      this.trackForm = this.fb.group({
        address: ['', Validators.required ]
      });

      this.modalService.open(content).result
      .then((result) => {
        //this.closeResult = `Closed with: ${result}`;
        //this.onTrackCoinSubmit();
      }, (reason) => {
        //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    public onTrackCoinSubmit(){
      if(!this.trackForm.pristine && !this.trackForm.invalid){

        this.http.get('https://api.etherscan.io/api?module=account&action=tokenbalance&tag=latest&apikey=I8BPFH9HMVTPI3QBE87J91ZFMTG6Z7SAB1&contractaddress=0xebc7cd2684dd96619841c7994343c5a8bda94b10&address='+ this.trackForm.value.address, this.trackForm.value)
        .subscribe((resp)=>{
          this.trackCoinData = resp.json();
          this.trackCoinData.result = this.trackCoinData.result/1000000000000000000;
          this.status = 200;
        },()=>{
          this.status = 500;
          this.message = "Failed to submit the information, please try after sometime";
        })
      }
    }

/*    public getChartData(){
        this.http.get('assets/world.js')
        .subscribe((resp)=>{
          Highcharts.maps["custom/world"] = resp;
          this.renderChart();
        },()=>{
          console.log("Chart data error");
        })    
    }*/

    public renderChart(){
        // Instantiate the map
        Highcharts.mapChart('world_map_container', {
            chart: {
                type: 'map',
                map: 'custom/world',
                borderWidth: 0,
                margin: [0,0,0,0],
                padding:[0,0,0,0],
                colors: ['#518D4B', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a']
            },

            title: {
                text: ''
            },

            subtitle: {
                text: ''
            },
            exporting:{
              enabled: false
            },
            legend: {
                enabled: false
            },
            credits:{
              enabled: false
            },
            series: [{
                name: 'Country',
                color: '#518D4B',
                data: [
                    ['ke', 1],
                    ['dk', 1],
                    ['au', 1],
                    ['br', 1],
                    ['in', 1],
                    ['KH', 1],
                    ['ru', 1],
                    ['us', 1],
                    ['bz', 1],
                    ['fr', 1],
                    ['ph', 1],
                    ['kr', 1],
                    ['vn', 1],
                    ['ng', 1],
                    ['eg', 1],
                    ['za', 1],
                    ['ch', 1],
                    ['de', 1],
                    ['uz', 1],
                    ['gr', 1],
                    ['th', 1],
                    ['cn', 1],
                    ['dk', 1],
                    ['co', 1],
                    ['ng', 1],
                    ['si', 1],
                    ['tr', 1],
                    ['mx', 1]
                ],
                dataLabels: {
                    allowOverlap: true,
                    overflow: false,
                    enabled: true,
                    color: '#000000',
                    formatter: function () {
                        if (this.point.value) {
                            return this.point.name;
                        }
                    }
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '{point.name}'
                }
            }]
        });

    }

}
