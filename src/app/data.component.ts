import { Component, OnInit, HostListener } from '@angular/core';
import { HttpService} from './http.service';
import {ParsTree} from './pars_tree'
import { Request } from './request';
import {DataManager} from './data_manager';
import { config } from './config';

declare let jQuery: any;

@Component({
    selector: 'data-app',
    template: `
		<div class="main">	 		
			<div class="block1">
			  <div class="time1">		    
				  <input type="text" id="datetimepicker1" name="time1" style="width:140px;" [(ngModel)]="time1" (change)="setTime1(time1)"/>
        </div>                  
        <div class="time2">                   
				  <label>-</label>
				  <input type="text" id="datetimepicker2" name="time2" style="width:140px;" [(ngModel)]="time2"/>
        </div>
      </div>
      
      <div class="block4">
        <select class="select" id="display_method" name="display_method" [(ngModel)]="check_method" (change)="setMethod(check_method)">
          <option value="chart" disabled checked>Select display method</option>
          <option value="chart">Chart</option>
          <option value="error_bar">Error bar</option>
          <option value="table">Table</option>
        </select>
      </div>  
      
      <div class="block5">            
        <div *ngIf="!data_sampler_condition&&!error_bar_condition">
          <select class="select" id="average" name="average" [(ngModel)]="field">
            <option value="avg" disabled checked>Select field</option>
            <option value="avg">Average value</option>
            <option value="min">Minimum value</option>
            <option value="max">Maximum value</option>
            <option value="mediana">Median</option>
            <option value="sygma">Sigma</option>
          </select>
        </div>
        
        <div *ngIf="!data_sampler_condition&&error_bar_condition">
          <select class="select" id="average" name="average" [(ngModel)]="field">
            <option value="avg" disabled checked>Select field</option>
            <option value="avg_sigma" checked>Average value with sigma</option>
            <option value="avg">Average value with min/max</option>                            
            <option value="mediana_sigma">Median with sigma</option>
            <option value="mediana">Median with min/max</option>
          </select>
        </div>  
        
        <div *ngIf="data_sampler_condition&&!error_bar_condition">                      
          <select class="select" id="average" name="average" [(ngModel)]="field">
            <option value="avg" disabled checked>Select field</option>
            <option value="left_bound" checked>Left border</option>
              <option value="right_bound">Right border</option>
              <option value="center">Central value</option>
              <option value="most_freq">Most frequent value</option>
          </select>
        </div>
        
        <div *ngIf="data_sampler_condition&&error_bar_condition">                      
          <select class="select" id="average" name="average" [(ngModel)]="field">  
            <option value="avg" disabled checked>Select field</option>
            <option value="center_bound" checked>Central value with bound</option>
            <option value="most_freq_bound">Most frequent value with bound</option>
          </select>
        </div>
      </div>               	
       
      <div class="block3"> 
          <select class="select" id="compression_method" name="compression_method" [(ngModel)]="check_level" (change)="setLevel(check_level)">
             <option value="average" disabled checked>Select compression method</option>
            <option value="average" checked>Average</option>
            <option value="data_sampler">Data Sampler</option>
          </select>
      </div>
                    
      <div class="button">
        <button class="btn btn-default" (click)="getCalculation()">Plot</button>
        <button class="btn btn-default" (click)="downloadScript()">Download</button>
      </div>   
			
      <div class="block2" id="block2">	 
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
    	 
    	 <div *ngIf="print_raw" class="print_raw" id="print_raw">
          <nav>
            <a routerLink="/data/info" routerLinkActive="active" id="info">Info</a>
          </nav>
          <pre>{{template}}</pre>	
			</div> 
    	 
      <div *ngIf="!print_raw" class="my-chart" id="my_chart">
        <my-chart (conditionChange)=conditionChange($event) [error_ber_condition]="error_bar_condition"[chart_condition]="chart_condition" [table_draw_condition]="table_draw_condition" [check_method]="check_method" [alarm_condition]="alarm_condition" [send_condition]="send_condition" [time1]="time1" [time2]="time2" [field]="field" [check_level]="check_level" [channels]="checked" [compress_level]="compress_level" [value] ="value" [condition]="graph_condition" [raw_condition]="view_raw_condition"></my-chart>
      </div>  
            	 
            	
	`,
	styles:[`
    .my-chart{
      float: right;
    }
    .main{
      float: left;
      width: 350px;
    }
		.select{
			width: 100%;
		}
		.channels li{
			width: 100%;
			padding: 0px;
		}
		.time1{
			width: 160px;
			float: left;			
		}
		.time2{		
			float: left;
			width: 175px;
		}
		.block2{
			float: left;
			width: 350px;
			height: 500px;
			overflow:scroll; 
		}
		.block1{
			float: left;
			margin: 5px;
		}
		.block3{
			float: left;
			width: 190px;	
			margin-left: 5px;
			margin-top: 10px;
			text-align: center;			
		}
		.button{
		 	float: left;
		 	margin-left: 20px;
		 	margin-top: 10px;
		}		
		.print_raw{
		  margin-top: 1%;
			float:right;
			border-style: ridge;	
			color: #444444;
			overflow-y: scroll;
		}
		.block4{
			float: left;			
	    width: 160px;
			text-align: center;
			margin-left: 5px;	
			margin-top: 5px;
		}
		.block5{			
			float: left;
			margin-left: 15px;	
			margin-top: 5px;		
			width: 160px;
			text-align: center;
			
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
	average: string;
	data_sampler: string;
	chart: string;
	error_bar: string;
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
    if((Date.parse(this.time2)-Date.parse(this.time1))<=0){
       alert("Enter the correct date");
    }
    else if(this.checked.length>6){
      alert("Select up to six channels");
    }
    else if(this.checked.length<1){
      alert("Сhoose channels");
    }
    else{
      this.setLevel("raw");
      this.print_raw = this.raw_conditin;
			this.httpService.getTemplate({t1:String(this.time1)+":00.00000", t2:String(this.time2)+":00.00000", channels: this.checked, level: "raw", "url": config.url["template_url"], "host": config.url["template_host"], "port": config.url["template_port"]}).subscribe(data=>{this.template=data["template"]; this.url=data["url"]});
      $(document).ready(function (){
        document.getElementById('print_raw').style.height = window.innerHeight - 120 + "px";
      document.getElementById('print_raw').style.width = window.innerWidth - 400 + "px";

      window.onresize = function () {
        document.getElementById('print_raw').style.height = window.innerHeight - 100 + "px";
        document.getElementById('print_raw').style.width = window.innerWidth - 400 + "px";
      };
      });

    }
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
    this.setLevel(this.check_level);
    if((Date.parse(this.time2)-Date.parse(this.time1))<=0){
       alert("Enter the correct date");
    }
    else if(this.checked.length>6){
      alert("Select up to six channels");
    }
    else if(this.checked.length<1){
      alert("Сhoose channels");
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
  }
	ngOnInit() {
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
      lang: "ru",
      onChangeDateTime:function(dp,$input){
          l_this.time2 = $input.val();
      }
    });
    jQuery('#datetimepicker2').on('click', function (){
      var x = jQuery('#datetimepicker1').datetimepicker('getValue');
      jQuery('#datetimepicker2').datetimepicker('setOptions', {startDate: new Date(l_this.time1)});
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
      document.getElementById('block2').style.height = window.innerHeight - 200 + "px";

      window.onresize = function () {
        document.getElementById('block2').style.height = window.innerHeight - 200 + "px";
      };


	}

	onSelect(channel: string) {
		this.selectedChannel = channel;
	}
	ngOnChanges(){
  }
}
