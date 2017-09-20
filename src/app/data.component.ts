import { Component, OnInit, HostListener } from '@angular/core';
import { HttpService} from './http.service';
import {ParsTree} from './pars_tree'
import { Request } from './request';
import {ElementRef, ViewChild} from '@angular/core';
import {DataManager} from './data_manager';
import {jQHTMLElement} from './jq_interface'
import { config } from './config';

declare let jQuery: any;

import * as $ from 'jquery';
import {ar} from "ngx-bootstrap/bs-moment/i18n/ar";

@Component({
    selector: 'data-app',
    template: `
		<div>	 		
			<div class="block1">
				    <div class="form-group">				    
				        <label>Time1</label>
				       <input type="text" id="datetimepicker1" name="time1" [(ngModel)]="time1" (change)="setTime1(time1)"/>
                    </div>               
                 
                     <div class="time2">                   
				        <label>Time2</label>
				        <input type="text" id="datetimepicker2" name="time2" [(ngModel)]="time2"/>
                    </div>
                </div>
                <div class="block3">            
            		<h3>Compression method</h3>
                	<div class="radio"><input type="radio" value="average" checked name="average" [(ngModel)]="check_level" [checked]="check_level==average" (change)="setLevel(check_level)"checked>average</div>
                	<div class="radio"><input type="radio" value="data_sampler" name="data_sampler" [(ngModel)]="check_level" [checked]="check_level==data_sampler" (change)="setLevel(check_level)">data_sampler</div>	
               
               	</div>
               	<div class="table">
                    <h3>Display method</h3>
                    <div class="radio"><input type="radio" value="chart" checked name="chart" [(ngModel)]="check_method" [checked]="check_method==chart" (change)="setMethod(check_method)"checked>chart</div>
                    <div class="radio"><input type="radio" value="error_bar" checked name="error_bar" [(ngModel)]="check_method" [checked]="check_method==error_bar" (change)="setMethod(check_method)">error_bar</div>
                    <div class="radio"><input type="radio" value="table" checked name="table" [(ngModel)]="check_method" [checked]="check_method==table" (change)="setMethod(check_method)">table</div>
                  </div>  
               	<div class="field">            
                    <h3>Field of table</h3>
                    	<div *ngIf="!data_sampler_condition&&!error_bar_condition">
                            <select class="select" id="average" name="average" [(ngModel)]="field">
                                <option value="avg" checked>Average value</option>
                                <option value="min">Minimum value</option>
                                <option value="max">Maximum value</option>
                                <option value="mediana">Median</option>
                                <option value="sygma">Sigma</option>
                            </select>
                    </div>
                      <div *ngIf="!data_sampler_condition&&error_bar_condition">
                            <select class="select" id="average" name="average" [(ngModel)]="field">
                                <option value="avg_sigma" checked>Average value with sigma</option>
                                <option value="avg" checked>Average value with min/max</option>                            
                                <option value="mediana_sigma">Median with sigma</option>
                                <option value="mediana">Median with min/max</option>
                            </select>
                    </div>  
                    	<div *ngIf="data_sampler_condition&&!error_bar_condition">                      
                            <select class="select" id="average" name="average" [(ngModel)]="field">
                                <option value="left_bound" checked>Left border</option>
                                <option value="right_bound">Right border</option>
                                <option value="center">Central value</option>
                                <option value="most_freq">Most frequent value</option>
                            </select>
                    	</div>
                    	<div *ngIf="data_sampler_condition&&error_bar_condition">                      
                            <select class="select" id="average" name="average" [(ngModel)]="field">                     
                                <option value="center">Central value with bound</option>
                                <option value="most_freq">Most frequent value with bound</option>
                            </select>
                    	</div>
                </div>               	
                    
                <div class="button">
                     	<button class="btn btn-default" (click)="getCalculation(time1, time2, false)">Send</button>
                     	<button class="btn btn-default" (click)="downloadScript()">Download</button>
               	</div>   
               	 <div *ngIf="!print_raw" class="my-chart">
               	    <my-chart (conditionChange)=conditionChange($event) [error_ber_condition]="error_bar_condition"[chart_condition]="chart_condition" [table_draw_condition]="table_draw_condition" [check_method]="check_method" [alarm_condition]="alarm_condition" [send_condition]="send_condition" [time1]="time1" [time2]="time2" [field]="field" [check_level]="check_level" [channels]="checked" [compress_level]="compress_level" [value] ="value" [condition]="graph_condition" [raw_condition]="view_raw_condition"></my-chart>
         
                 </div>               
				<br>
				<div *ngIf="print_raw" class="print_raw">
          <nav>
            <a routerLink="/data/info" routerLinkActive="active">Info</a>
          </nav>
          <pre>{{template}}</pre>			
					
				</div>
               	<div class="block2">	 
                    <div style="overflow:scroll; height: 500px;">
                         <ul class="channels" >				 
				               <li *ngFor="let channel of channels"
				                [class.selected]="channel.name === selectedChannel"
				                (click)="onSelect(channel.name)">	
				                	<div *ngIf="!channel.condition">
										<details>
										<summary>{{channel.name}}</summary>
											<ul>
												<my-data-detail [channel]="arr[channel.name]" [checked]="checked"></my-data-detail>
											</ul>
										</details>
        		                    </div>
        		                    <div *ngIf="channel.condition">
        		                    	<input type="checkbox" value="{{channel.name}}" (change)="setCheck(channel.name)"/> {{channel.name}}
        		                    </div>
				   						
				                </li>
                         </ul>	
                    </div>                   
                 
             	</div>  
           </div>
                  
                
				
	`,
	styles:[`
		.select{
			width: 200px;
		}
		.axis path,
	  .axis line{
		fill: none;
		stroke: black;
	  }
	
	  .line{
		fill: none;
		stroke: blue;
		stroke-width: 2px;
	  }
	
	  .tick text{
		font-size: 12px;
	  }
	
	  .tick line{
		opacity: 0.2;
	  }
		.radio{
			float: left;
		}
		.channels li{
			width: 270px;
			padding: 0px;
		}
		.form-group{
			width: 300px;
			float: left;
			margin-top: -5px;
			
		}
		.time2{			
			padding-top: 50px;
			width: 300px;
			margin-top: -20px;
		}
		.block2{
			float: left;
			padding: 0px;
			margin-left: 1000px;
			margin-top: -520px;
		
		}
		.block1{
			float: left;
			width: 140px;
			margin-top: 80px;
			margin-left: -25%;
		}
		.block3{
			float: left;
			margin-left: -5%;
			margin-top: 55px;
			text-align: center;
			
		}
		.button{
		 	padding-top: 135px;
		  
		}		
		.print_raw{
		  padding-top: -10px;
			padding-left: 10px;
			width: 960px;
			height: 500px;
			float:left;
			border-style: ridge;	
			color: #444444;
			overflow-y: scroll;
		}
		.table{
			float: left;
			
			margin-top: 55px;
			text-align: center;
					
		}
		.field{
			
			float: left;
			
			margin-top: 55px;
			text-align: center;
			
		}
		. block3 h3{
			padding: 0px;
			margin: 0px;
			-webkit-margin-before: 0px;
			font-size: 0px;			
		}
		input[type=range].slider1 {
		  -webkit-appearance: none;
		  margin-left: 60px;
		  width: 850px;
		}
		input[type=range].slider2 {
		  -webkit-appearance: none;
		  margin-left: 60px;
		  margin-top: -10px;
		  width: 850px;
		}
		input[type=range]:focus {
		  outline: none;
		}
		input[type=range].slider1::-webkit-slider-runnable-track {
		  width: 850px;
		  height: 8.4px;
		  cursor: pointer;
		  animate: 0.2s;
		  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
		  background: #3071a9;
		  border-radius: 1.3px;
		  border: 0.2px solid #010101;
		}
		input[type=range].slider2::-webkit-slider-runnable-track {
		  width: 850px;
		  height: 8.4px;
		  cursor: pointer;
		  animate: 0.2s;
		  box-shadow: transparent;
		  background: transparent;
		  border-radius: 0px;
		  border: transparent;
		}
		input[type=range].slider1::-webkit-slider-thumb {
		  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
		  border: 1px solid #000000;
		  height: 25px;
		  width: 16px;
		  border-radius: 3px;
		  background: #ffffff;
		  cursor: pointer;
		  -webkit-appearance: none;
		  margin-top: -10px;
		}
		input[type=range].slider2::-webkit-slider-thumb {
		  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
		  border: 1px solid #000000;
		  height: 25px;
		  width: 16px;
		  border-radius: 3px;
		  background: #ffffff;
		  cursor: pointer;
		  -webkit-appearance: none;
		  margin-top: -26px;
		}
		
		input[type=range].slider1:focus::-webkit-slider-runnable-track {
		  background: #367ebd;
		}
		input[type=range].slider1::-moz-range-track {
		  width: 850px;
		  height: 8.4px;
		  cursor: pointer;
		  animate: 0.2s;
		  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
		  background: #3071a9;
		  border-radius: 1.3px;
		  border: 0.2px solid #010101;
		}
		input[type=range]::-moz-range-thumb {
		  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
		  border: 1px solid #000000;
		  height: 36px;
		  width: 16px;
		  border-radius: 3px;
		  background: #ffffff;
		  cursor: pointer;
		}
		input[type=range].slider1::-ms-track {
		  width: 850px;
		  height: 8.4px;
		  cursor: pointer;
		  animate: 0.2s;
		  background: transparent;
		  border-color: transparent;
		  border-width: 16px 0;
		  color: transparent;
		}
		input[type=range]::-ms-fill-lower {
		  background: #2a6495;
		  border: 0.2px solid #010101;
		  border-radius: 2.6px;
		  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
		}
		input[type=range]::-ms-fill-upper {
		  background: #3071a9;
		  border: 0.2px solid #010101;
		  border-radius: 2.6px;
		  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
		}
		input[type=range]::-ms-thumb {
		  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
		  border: 1px solid #000000;
		  height: 36px;
		  width: 16px;
		  border-radius: 3px;
		  background: #ffffff;
		  cursor: pointer;
		}
		input[type=range]:focus::-ms-fill-lower {
		  background: #3071a9;
		}
		input[type=range]:focus::-ms-fill-upper {
		  background: #367ebd;
		}

	`],
	providers: [HttpService, ParsTree]

})
export class DataComponent implements OnInit{

	draw_condition: boolean = false;
	delta: number;
	compress_level_arr: any[] = [{"level":"raw", "condition": true},
		{"level": "first_level", "condition": false},
		{"level": "second_level", "condition": false},
		{"level": "third_level", "condition": false}];
	data_arr: any[] =[];
    time1: string;
    time2: string;
    channelsresponse: any[] = [];
    check_level: string = "average";
    check_method: string = "chart";
    compress_level: number;
	arr: {[id: string]: {[id: string]: any}} = {};
	channels: any[] = [];
	error: any;
	table_draw_condition: boolean;
	selectedChannel: string;
	checked: any[] = [];
	data: any;
	current_chunk: DataManager;
	condition: boolean = false;
	value: number;
	type = 'line';
	average_condition: boolean = false;
	data_sampler_condition: boolean = false;
	raw_conditin: boolean = false;
	view_raw_condition: boolean = false;
	graph_condition: boolean = false;
	field: string = "avg";
	print_raw: boolean = false;
	template: any[] = [];
	send_condition: boolean = false;
	error_bar_condition: boolean = false;
	chart_condition: boolean = true;
	alarm_condition: any = {"checked": [false, false, false, false],
							"disabled": [true, true, true, true]};
	url: string;


	constructor(private httpService: HttpService, private parsTree: ParsTree) {

	}
	conditionChange(condition:boolean){
		this.send_condition = condition;
	}
	setMethod(check_level: string){
		if(check_level=="chart"){
			this.table_draw_condition = false;
			this.error_bar_condition = false;
			this.chart_condition = true;
		}
		else if(check_level=="error_bar"){
			this.table_draw_condition = false;
			this.error_bar_condition = true;
			this.chart_condition = false;
		}
		else {
			this.table_draw_condition = true;
			this.error_bar_condition = false;
			this.chart_condition = false;
		}

	}
	setLevel(name_level: string){
		if(name_level=="average"){
			this.average_condition = true;
			this.data_sampler_condition = false;
			this.raw_conditin = false;
		}
		else if(name_level=="data_sampler"){
			this.average_condition = false;
			this.data_sampler_condition = true;
			this.raw_conditin = false;
		}
		else if(name_level="raw"){
			this.average_condition = false;
			this.data_sampler_condition = false;
			this.raw_conditin = true;
		}

	}
  downloadScript(){
	    this.setLevel("raw");

      this.print_raw = this.raw_conditin;
			this.httpService.getTemplate({t1:String(this.time1)+":00.00000", t2:String(this.time2)+":00.00000", channels: this.checked, level: "raw"}).subscribe(data=>{this.template=data["template"]; this.url=data["url"]});
	}
	createPointChart(data: any[], l_this: any){
	    l_this.data_arr = [];
		for(var i in data){
        	for(var key in data[i]){
            	if(key!="next"){
                	if(l_this.data_arr[key]){
	                    var arr: any[] = [];
						arr = l_this.data_arr[key].concat(data[i][key]);
                        l_this.data_arr[key]=arr;
                    }
                    else {
                        l_this.data_arr[key]=data[i][key];
                    }
                }
            }
        }


		this.graph_condition = true;

	}


	getData(time1: string, time2:string, compress_level: string, channels: any[], check_level: string){
		var request = new Request(time1, time2, channels, check_level, compress_level, this.httpService);
		request.execute(this);
	}

	getCalculation(){
    this.print_raw = false;
    console.log(this.time1, this.time2, Date.parse(this.time2)-Date.parse(this.time1));

    if((Date.parse(this.time2)-Date.parse(this.time1))<=0){
       alert("Enter the correct date");
    }
    else if(this.checked.length>6){
      alert("Select up to six channels");
    }
    else{
      this.value=this.checked.length-1;
			this.delta = (Date.parse(this.time2) - Date.parse(this.time1))*this.checked.length;
			if(this.delta<=config.interval[0]){
				this.compress_level = 0;
			}
			else if(this.delta<=config.interval[1]){
				this.compress_level = 1;
			}
			else if(this.delta<=config.interval[2]){
				this.compress_level = 2;
			}
			else{
				this.compress_level = 3;
			}

      this.condition = true;
      this.draw_condition = false;
      this.send_condition = true;
      this.view_raw_condition = this.compress_level_arr[this.compress_level]["condition"];
      this.print_raw = this.raw_conditin;
      for(var i in this.alarm_condition["checked"]){
          if(parseInt(i)==this.compress_level){
            this.alarm_condition["checked"][i]=true;
            this.alarm_condition["disabled"][i]=false;
          }
          else{
            this.alarm_condition["checked"][i]=false;
            this.alarm_condition["disabled"][i]=true;
          }
        }
      this.graph_condition = false;
    }

	}

	setCheck(element: any){
		var index = this.checked.indexOf(element);
		if (index===-1) {
			this.checked.push(element);
		}
		else{

			this.checked.splice(index, 1);

		}

	}
	setTime1(time:string){
	  this.time1 = time;
	  console.log(this.time1);
  }
	ngOnInit() {
	  console.log(config.interval);
	  let l_this = this;
	  jQuery('#datetimepicker1').datetimepicker({
      format:"Y-m-d H:i",
      formatDate: "Y-m-d",
      formatTime: "H:i",
      minTime: "00:00",
      step: 30,
      minDate: "2013/01/01",
      maxDate: 0,
      startDate: new Date(Date.now()),
      lang: "ru",
      onChangeDateTime:function(dp,$input){
         l_this.time1 = $input.val();
      }
    });
    jQuery('#datetimepicker2').datetimepicker({
      format:"Y-m-d H:i",
      formatDate: "Y-m-d",
      formatTime: "H:i",
      step: 30,
      minDate: "2013/01/01",
      maxDate: 0,
      startDate: new Date(Date.now()),
      lang: "ru",
      onChangeDateTime:function(dp,$input){
          l_this.time2 = $input.val();
      }
    });
		this.current_chunk = new DataManager();
		this.httpService.getData()
            .subscribe(
				data => {
					this.channelsresponse = data;
					this.arr = this.parsTree.getChannel(data);
					let array_name = Object.keys(this.channelsresponse).sort();
					let buff: any[] = [];
					for(let i = 0; i<array_name.length; i++){
					  buff[array_name[i]] = this.channelsresponse[array_name[i]];
          }
          this.channelsresponse = buff;
					for (var key in this.channelsresponse) {
						if((this.channelsresponse[key].length===1) && (this.channelsresponse[key][0].id)){
							this.channels.push({name:key, condition:true});

						}
						else{
							this.channels.push({name:key, condition:false});
						}
					}
				},
				error => {
					this.error = error;
					console.log(error);
				}
			);
	}

	onSelect(channel: string) {
		this.selectedChannel = channel;
	}
	ngOnChanges(){
  }
}
