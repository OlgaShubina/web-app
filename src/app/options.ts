import { Component, Input, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
import { Request } from './request';
import {DataComponent} from "./data.component";
import {HttpService} from './http.service';
import {PlotHTMLElement} from './interface';
import {config} from './config';
declare let Plotly: any;

@Component({
  selector: 'my-chart',
  template:`    
    <div class="loader" *ngIf="send_condition" id="wrapper">
      <div id="border">
        <div id="whitespace">
          <div id="line">
          </div>
        </div>
      </div>
    </div>
	<div *ngIf="chart_condition || error_ber_condition" class="myCanvas" id="myDiv" style="width: 100%; height: 100%;"></div>
	
	<div *ngIf="table_draw_condition" width="100%" class="table_class" id="table">
		<table border="1" width="970" cellpadding="5" *ngFor="let name of channels_name">
			<tr><th>{{name}}</th></tr>
			<tr>
		   		<th *ngFor="let key of table_keys">{{key}}</th>
     		</tr>
			<tr *ngFor="let data of table_arr[name]">
				
			  	<td *ngFor="let row of data" >{{row}}</td>
	 	</table>
	</div>
	<div class="detail">                
    	<div class="checkbox"><input  type="checkbox" value="{{auto}}" (change)="setCheck()"/> auto</div>        
        <nav class="segmented-button">
			  <input type="radio" name="seg-1" value="raw" id="seg-raw" (click)="reloadData(0)" [checked]="alarm_condition.checked[0]" [disabled]="alarm_condition.disabled[0]">
			  <label for="seg-raw" class="first">raw</label>
			  <input type="radio" name="seg-1" value="level1" id="seg-level1" (click)="reloadData(1)" [checked]="alarm_condition.checked[1]" [disabled]="alarm_condition.disabled[1]">
			  <label for="seg-level1">level 1</label>
			  <input type="radio" name="seg-1" value="level2" id="seg-level2" (click)="reloadData(2)" [checked]="alarm_condition.checked[2]" [disabled]="alarm_condition.disabled[2]">
			  <label for="seg-level2">level 2</label>
			  <input type="radio" name="seg-1" value="level3" id="seg-level3" (click)="reloadData(3)" [checked]="alarm_condition.checked[3]" [disabled]="alarm_condition.disabled[3]">
			  <label for="seg-level3" class="last">level 3</label>
		    </nav>
       
   </div>
  	
  `,
  styles:[`
		.checkbox{
			float: left;
			padding-right: 10px;
		}
		.detail{
			float: top;
			text-align: center;
		}
		.myCanvas{
			position: relative;
			float:right;
			margin-top: 1%;			
			border-color: black;
		}
		.segmented-button {
		  float: left;
		  
		}
		.segmented-button input[type="radio"] {
		  width: 0px;
		  height: 0px;
		  display: none;
		}
		.segmented-button label {
		  display: -moz-inline-box;
		  -moz-box-orient: vertical;
		  display: inline-block;
		  vertical-align: middle;
		  *vertical-align: auto;
		  -moz-border-radius: 4px;
		  -webkit-border-radius: 4px;
		  -o-border-radius: 4px;
		  -ms-border-radius: 4px;
		  -khtml-border-radius: 4px;
		  border-radius: 4px;
		  text-shadow: white;
		  background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #ffffff), color-stop(100%, #e4e4e4));
		  background: -webkit-linear-gradient(#ffffff, #e4e4e4);
		  background: -moz-linear-gradient(#ffffff, #e4e4e4);
		  background: -o-linear-gradient(#ffffff, #e4e4e4);
		  background: -ms-linear-gradient(#ffffff, #e4e4e4);
		  background: linear-gradient(#ffffff, #e4e4e4);
		  border: 1px solid #b2b2b2;
		  color: #666666;
		  padding: 5px 24px;
		  padding-bottom: 3px;
		  font-size: 12px;
		  cursor: pointer;
		  font-family: Helvetica;
		  -moz-border-radius: 0px;
		  -webkit-border-radius: 0px;
		  -o-border-radius: 0px;
		  -ms-border-radius: 0px;
		  -khtml-border-radius: 0px;
		  border-radius: 0px;
		  margin-right: -5px;
		}
		.segmented-button label {
		  *display: inline;
		}
		.segmented-button label:hover {
		  -moz-box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
		  -webkit-box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
		  -o-box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
		  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
		  color: #333333;
		}
		.segmented-button label:active, .segmented-button label.active {
		  background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #e4e4e4), color-stop(100%, #ffffff));
		  background: -webkit-linear-gradient(#e4e4e4, #ffffff);
		  background: -moz-linear-gradient(#e4e4e4, #ffffff);
		  background: -o-linear-gradient(#e4e4e4, #ffffff);
		  background: -ms-linear-gradient(#e4e4e4, #ffffff);
		  background: linear-gradient(#e4e4e4, #ffffff);
		}
		.segmented-button label:disabled, .segmented-button label.disabled {
		  background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #ffffff), color-stop(100%, #efefef));
		  background: -webkit-linear-gradient(#ffffff, #efefef);
		  background: -moz-linear-gradient(#ffffff, #efefef);
		  background: -o-linear-gradient(#ffffff, #efefef);
		  background: -ms-linear-gradient(#ffffff, #efefef);
		  background: linear-gradient(#ffffff, #efefef);
		  cursor: default;
		  color: #b2b2b2;
		  border-color: #cccccc;
		  -moz-box-shadow: none;
		  -webkit-box-shadow: none;
		  -o-box-shadow: none;
		  box-shadow: none;
		}
		.segmented-button label.first {
		  -moz-border-radius-topleft: 4px;
		  -webkit-border-top-left-radius: 4px;
		  -o-border-top-left-radius: 4px;
		  -ms-border-top-left-radius: 4px;
		  -khtml-border-top-left-radius: 4px;
		  border-top-left-radius: 4px;
		  -moz-border-radius-bottomleft: 4px;
		  -webkit-border-bottom-left-radius: 4px;
		  -o-border-bottom-left-radius: 4px;
		  -ms-border-bottom-left-radius: 4px;
		  -khtml-border-bottom-left-radius: 4px;
		  border-bottom-left-radius: 4px;
		}
		.segmented-button label.last {
		  -moz-border-radius-topright: 4px;
		  -webkit-border-top-right-radius: 4px;
		  -o-border-top-right-radius: 4px;
		  -ms-border-top-right-radius: 4px;
		  -khtml-border-top-right-radius: 4px;
		  border-top-right-radius: 4px;
		  -moz-border-radius-bottomright: 4px;
		  -webkit-border-bottom-right-radius: 4px;
		  -o-border-bottom-right-radius: 4px;
		  -ms-border-bottom-right-radius: 4px;
		  -khtml-border-bottom-right-radius: 4px;
		  border-bottom-right-radius: 4px;
		}
		.segmented-button input:checked + label, .segmented-button label.selected {
		  background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #e4e4e4), color-stop(100%, #ffffff));
		  background: -webkit-linear-gradient(#e4e4e4, #ffffff);
		  background: -moz-linear-gradient(#e4e4e4, #ffffff);
		  background: -o-linear-gradient(#e4e4e4, #ffffff);
		  background: -ms-linear-gradient(#e4e4e4, #ffffff);
		  background: linear-gradient(#e4e4e4, #ffffff);
		}
		.segmented-button input:disabled + label {
		  background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #ffffff), color-stop(100%, #efefef));
		  background: -webkit-linear-gradient(#ffffff, #efefef);
		  background: -moz-linear-gradient(#ffffff, #efefef);
		  background: -o-linear-gradient(#ffffff, #efefef);
		  background: -ms-linear-gradient(#ffffff, #efefef);
		  background: linear-gradient(#ffffff, #efefef);
		  cursor: default;
		  color: #b2b2b2;
		  border-color: #cccccc;
		  -moz-box-shadow: none;
		  -webkit-box-shadow: none;
		  -o-box-shadow: none;
		  box-shadow: none;
		}
		.table_class{
			overflow-y:scroll;
		}
		
    .loader{
      z-index: 2;
    }
    #wrapper {
      width: 200px;
      height: 20px;
      position: absolute;
      top: 60%;
      left: 60%;
    }
    
    #border {
      border: 3px solid #373737;
      height: 100%;
      width: 100%;
      position: relative;
      left: -50%;
      top: -50%;
      padding: 4px 3px;
    }
    
    #whitespace {
      overflow: hidden;
      height: 100%;
      width: 100%;
      margin: 0 auto;
      overflow: hidden;
      position: relative;
    }
    
    #line {
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: #373737;
      -webkit-animation: slide 5s steps(40) infinite;
      -moz-animation: slide 5s steps(40) infinite;
      animation: slide 5s steps(40) infinite;
    }
    
    @keyframes slide {
      0% {
        left: -100%;
      }
      
      100% {
        left: 100%;
      }
    }
    
    @-moz-keyframes slide {
      0% {
        left: -100%;
      }
      
      100% {
        left: 100%;
      }
    }
    
    @-webkit-keyframes slide {
      0% {
        left: -100%;
      }
      
      100% {
        left: 100%;
      }
    }
`],
	providers: [DataComponent]
})


export class Options {
	type = 'line';
	time: any;
	@Input() send_condition: boolean;
	@Output('conditionChange') conditionChange = new EventEmitter<boolean>();
	data_arr: any[] = [];
	@Input() condition: boolean;
	@Input() raw_condition: boolean;
	@Input() value: number;
	@Input() check_level: string;
	@Input() field: string;
	@Input() compress_level: number;
	@Input() channels: any[];
	@Input() time1: string;
	@Input() time2: string;
	@Input() table_draw_condition: boolean;
	@Input() check_method: string;
  @Input() chart_condition: boolean = true;
  @Input() error_ber_condition: boolean = false;
  auto: string;
	data: any;
	arr: any;
	start_arr: number = 0;
	end_arr: number=0;
	table_keys: string[] = [];
	channels_name:string[] = [];
	table_arr: {[id:string]: any} = {};
	auto_detalazing_condition: boolean = false;
	time_arr: {[id: number]: any[]} = {};
	compress_level_arr: any[] = [{"level":"raw", "condition": true},
		{"level": "first_level", "condition": false},
		{"level": "second_level", "condition": false},
		{"level": "third_level", "condition": false}];
	@Input() alarm_condition: any = {"checked": [false, false, false, false],
							"disabled": [true, true, true, true]};
    borderColor = [
        'rgba(3, 54, 88, 0.8)',
        'rgba(83, 0, 6, 0.8)',
        'rgba(128, 128, 0, 0.8)',
        'rgba(0, 191, 255, 0.8)',
        'rgba(220, 20, 60, 0.8)',
        'rgba(205, 102, 0, 0.8)',
        'rgba(43, 46, 87, 0.8)',
        'rgba(139, 69, 19, 0.8)',
        'rgba(93, 71, 139, 0.8)',
    ];
	backgroundColor = [
	    'rgba(3,54,88, 0.1)',
        'rgba(83,0,6, 0.1)',
        'rgba(128, 128, 0, 0.1)',
        'rgba(0, 0, 0, 0.1)',
        'rgba(0, 191, 255, 0.1)',
        'rgba(205, 102, 0, 0.1)',
        'rgba(220, 20, 60, 0.1)',
        'rgba(43, 46, 87, 0.1)',
        'rgba(139, 69, 19, 0.1)',
        'rgba(93, 71, 139, 0.1)',
    ];

    options = [{
        position: 50,
        margin: {
          l: 30,
          r: 50,
          b: 35,
          t: 30
        },
			  legend: {
          x: 0,
          y: 100,
          orientation: "h"
        },
        yaxis1: {
          titlefont: {color: 'rgba(3, 54, 88, 0.8)'},
          tickfont: {color: 'rgba(3, 54, 88, 0.8)'}
        }
      },{
      position: 50, margin: {
        l: 30, r: 50, b: 35, t: 30
      }, legend: {
        x: 0, y: 100, orientation: "h"
      }, yaxis1: {
        titlefont: {color: 'rgba(3, 54, 88, 0.8)'}, tickfont: {color: 'rgba(3, 54, 88, 0.8)'}, side: 'right'
      }, yaxis2: {
        titlefont: {color: 'rgba(83, 0, 6, 0.8)'},
        tickfont: {color: 'rgba(83, 0, 6, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left'
      }
    }, {
      position: 50, margin: {
        l: 30, r: 50, b: 35, t: 30
      }, legend: {
        x: 0, y: 100, orientation: "h"
      }, yaxis1: {
        titlefont: {color: 'rgba(3, 54, 88, 0.8)'}, tickfont: {color: 'rgba(3, 54, 88, 0.8)'}, side: 'right'
      }, yaxis2: {
        titlefont: {color: 'rgba(83, 0, 6, 0.8)'},
        tickfont: {color: 'rgba(83, 0, 6, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left'
      }, yaxis3: {
        titlefont: {color: 'rgba(128, 128, 0, 0.8)',},
        tickfont: {color: 'rgba(128, 128, 0, 0.8)',},
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 0.01
      }
    }, {
      position: 50, margin: {
        l: 30, r: 50, b: 35, t: 30
      }, legend: {
        x: 0, y: 100, orientation: "h"
      }, yaxis1: {
        titlefont: {color: 'rgba(3, 54, 88, 0.8)'}, tickfont: {color: 'rgba(3, 54, 88, 0.8)'}, side: 'right'
      }, yaxis2: {
        titlefont: {color: 'rgba(83, 0, 6, 0.8)'},
        tickfont: {color: 'rgba(83, 0, 6, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left'
      }, yaxis3: {
        titlefont: {color: 'rgba(128, 128, 0, 0.8)',},
        tickfont: {color: 'rgba(128, 128, 0, 0.8)',},
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 0.01
      }, yaxis4: {
        titlefont: {color: 'rgba(0, 191, 255, 0.8)'},
        tickfont: {color: 'rgba(0, 191, 255, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left',
        position: 1
      }
    },{
      position: 50, margin: {
        l: 30, r: 50, b: 35, t: 30
      }, legend: {
        x: 0, y: 100, orientation: "h"
      }, yaxis1: {
        titlefont: {color: 'rgba(3, 54, 88, 0.8)'}, tickfont: {color: 'rgba(3, 54, 88, 0.8)'}, side: 'right'
      },yaxis2: {
        titlefont: {color: 'rgba(83, 0, 6, 0.8)'},
        tickfont: {color: 'rgba(83, 0, 6, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left'
      }, yaxis3: {
        titlefont: {color: 'rgba(128, 128, 0, 0.8)',},
        tickfont: {color: 'rgba(128, 128, 0, 0.8)',},
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 0.01
      }, yaxis4: {
        titlefont: {color: 'rgba(0, 191, 255, 0.8)'},
        tickfont: {color: 'rgba(0, 191, 255, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left',
        position: 1
      },yaxis5: {
        titlefont: {color: 'rgba(220, 20, 60, 0.8)'},
        tickfont: {color: 'rgba(220, 20, 60, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 0.02
      }
    },{
      position: 50, margin: {
        l: 30, r: 50, b: 35, t: 30
      }, legend: {
        x: 0, y: 100, orientation: "h"
      },yaxis1: {
        titlefont: {color: 'rgba(3, 54, 88, 0.8)'}, tickfont: {color: 'rgba(3, 54, 88, 0.8)'},side: 'right'
      },yaxis2: {
        titlefont: {color: 'rgba(83, 0, 6, 0.8)'},
        tickfont: {color: 'rgba(83, 0, 6, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left'
      }, yaxis3: {
        titlefont: {color: 'rgba(128, 128, 0, 0.8)',},
        tickfont: {color: 'rgba(128, 128, 0, 0.8)',},
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 0.01
      }, yaxis4: {
        titlefont: {color: 'rgba(0, 191, 255, 0.8)'},
        tickfont: {color: 'rgba(0, 191, 255, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left',
        position: 1
      },yaxis5: {
        titlefont: {color: 'rgba(220, 20, 60, 0.8)'},
        tickfont: {color: 'rgba(220, 20, 60, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 0.02
      },yaxis6: {
        titlefont: {color: 'rgba(205, 102, 0, 0.8)'},
        tickfont: {color: 'rgba(205, 102, 0, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left',
        position: 0.98
      }
    }]
    constructor(public dataComponent: DataComponent, private httpService: HttpService){};


	setCheck(){
		this.auto_detalazing_condition=!this.auto_detalazing_condition;
	}
	setMethod(check_level: string){
		if(check_level=="chart"){
			this.table_draw_condition = false;
		}
		else if(check_level=="error_bar"){
			this.table_draw_condition = false;
		}
		else {
			this.table_draw_condition = true;

		}

	}

  time_format(time:any): string{
		let time1 = new Date(time);
		return time1.getFullYear()+"-"+((time1.getMonth()+1 < 10) ? ("0" + (time1.getMonth()+1)) : (time1.getMonth()+1)) +"-"+((time1.getDate()< 10) ? ("0" + (time1.getDate())) : (time1.getDate()))+" "+((time1.getHours()< 10) ? ("0" + (time1.getHours())) : (time1.getHours()))+":"+((time1.getMinutes()< 10) ? ("0" + (time1.getMinutes())) : (time1.getMinutes()))+":"+((time1.getSeconds()< 10) ? ("0" + (time1.getSeconds())) : (time1.getSeconds()))+".00000";

	 }

	 reloadData(level: number){
	 		if(this.auto_detalazing_condition){
	 		  this.compress_level = level;
	 		  this.createDataChart();
			}
	 		else if(level<this.compress_level){
	 		  this.condition = false;
	 			this.compress_level -= 1;
	 			//this.time1 = this.time_format(this.start_arr);
	 			//this.time2 = this.time_format(this.end_arr);
	 			this.send_condition = true;
        this.conditionChange.emit(true);
	 			var request = new Request(this.time_format(this.start_arr), this.time_format(this.end_arr), this.channels, this.check_level, this.compress_level_arr[this.compress_level]["level"], this.httpService);
				request.execute(this);
			}
			else{
	 			this.compress_level+=1;
	 			this.createDataChart();
	 			this.alarm_condition["disabled"][this.compress_level-1] = true;
			}
	}

	ngOnChanges(){
		if(this.send_condition==true){
			var request = new Request(String(this.time1)+":00.00000", String(this.time2)+":00.00000", this.channels, this.check_level, this.compress_level_arr[this.compress_level]["level"], this.httpService);
			request.execute(this);
		}
		else{
		  this.createDataChart();
		  if(this.table_draw_condition==true){
		     $(document).ready(function () {
		        document.getElementById('table').style.height=window.innerHeight-120+"px";
            document.getElementById('table').style.width=window.innerWidth-400+"px";
            window.onresize = function(){
              document.getElementById('table').style.height=window.innerHeight-120+"px";
              document.getElementById('table').style.width=window.innerWidth-400+"px";
            };
         });
      }
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
      this.time_arr[this.compress_level] = l_this.data_arr;
      this.condition = true;
	}
   createDataChart(){
	    if(this.condition) {
	      try {
          var labels: string[] = [];
          var name_channels: string[] = [];
          this.table_keys = [];
          var m = 1;
          this.data_arr = this.time_arr[this.compress_level];
          for (var key in this.data_arr) {
            name_channels.push(key);
          }
          this.channels_name = name_channels
          for (var key in this.data_arr[name_channels[0]][0]) {
            this.table_keys.push(key);
          }
          for (var i in this.data_arr[name_channels[0]]) {
            labels.push(this.data_arr[name_channels[0]][i].time);
          }
          var cur: any[] = [];

          for (var i in this.data_arr) {
            let c_arr: any[] = [];
            var x: any[] = [];
            var y: any[] = [];
            var error1: any[] = [];
            var error2: any[] = [];
            var all_data: any[] = [];
            for (var k in this.data_arr[i]) {
              let arr: any[] = [];
              for (let x in this.data_arr[i][k]) {
                arr.push(this.data_arr[i][k][x]);
              }
              c_arr.push(arr);
              this.raw_condition = this.compress_level_arr[this.compress_level]["condition"];

              if (this.raw_condition) {
                x.push(this.data_arr[i][k]["time"]);
                y.push(this.data_arr[i][k]["value"]);
              }
              else if (this.check_method == "chart") {
                x.push(this.data_arr[i][k]["time"]);
                y.push(this.data_arr[i][k][this.field]);
                var str: string = '\0';
                for (var key in this.data_arr[i][k]) {
                  if (key != "time") {
                    str += String(key) + ':' + String(this.data_arr[i][k][key]) + "\t";
                  }

                }
                all_data.push(str);
              }
              else {
                switch (this.field) {
                  case 'avg':
                    x.push(this.data_arr[i][k]["time"]);
                    y.push(this.data_arr[i][k]["avg"]);
                    error1.push(this.data_arr[i][k]["max"] - this.data_arr[i][k]["avg"]);
                    error2.push(this.data_arr[i][k]["avg"] - this.data_arr[i][k]["min"]);
                    break;
                  case "avg_sigma":
                    x.push(this.data_arr[i][k]["time"]);
                    y.push(this.data_arr[i][k]["avg"]);
                    error1.push(this.data_arr[i][k]["sygma"]);
                    error2.push(this.data_arr[i][k]["sygma"]);
                    break;
                  case "mediana":
                    x.push(this.data_arr[i][k]["time"]);
                    y.push(this.data_arr[i][k]["mediana"]);
                    error1.push(this.data_arr[i][k]["max"] - this.data_arr[i][k]["mediana"]);
                    error2.push(this.data_arr[i][k]["mediana"] - this.data_arr[i][k]["min"]);
                    break;
                  case "mediana_sigma":
                    x.push(this.data_arr[i][k]["time"]);
                    y.push(this.data_arr[i][k]["mediana"]);
                    error1.push(this.data_arr[i][k]["sygma"]);
                    error2.push(this.data_arr[i][k]["sygma"]);
                    break;
                  case "center_bound":
                    x.push(this.data_arr[i][k]["time"]);
                    y.push(this.data_arr[i][k]["center"]);
                    error1.push(this.data_arr[i][k]["right_bound"] - this.data_arr[i][k]["center"]);
                    error2.push(this.data_arr[i][k]["center"] - this.data_arr[i][k]["right_bound"]);
                    break;
                  case "most_freq_bound":
                    x.push(this.data_arr[i][k]["time"]);
                    y.push(this.data_arr[i][k]["most_freq"]);
                    error1.push(this.data_arr[i][k]["right_bound"] - this.data_arr[i][k]["most_freq"]);
                    error2.push(this.data_arr[i][k]["most_freq"] - this.data_arr[i][k]["right_bound"]);
                    break;
                }
              }

            }
            this.table_arr[i] = c_arr;

            cur.push({
              x: x, y: y, error_y: {
                symmetric: false,
                array: error1,
                arrayminus: error2,
                visible: true,
                opacity: 0.5,
                color: this.borderColor[m-1]
              }, name: i, pointRadius: 1, yaxis: "y" + String(m), type: 'scatter', line: {color: this.borderColor[m-1]}
            });

            m = m + 1;
          }
          let local_this = this;

          var layout = this.options[this.value];
          $(document).ready(function () {
            document.getElementById('myDiv').style.height=window.innerHeight-120+"px";
            document.getElementById('myDiv').style.width=window.innerWidth-400+"px";
            window.onresize = function(){
              document.getElementById('myDiv').style.height=window.innerHeight-120+"px";
              document.getElementById('myDiv').style.width=window.innerWidth-400+"px";
            };
            Plotly.newPlot('myDiv', cur, layout)
            var myPlot = <PlotHTMLElement>document.getElementById('myDiv');
            let l_this = local_this;
            local_this.send_condition = false;
            local_this.conditionChange.emit(false);
            myPlot.on('plotly_relayout', function (eventdata: any) {
              if (((l_this.auto_detalazing_condition) && ((Date.parse(eventdata['xaxis.range[1]']) - Date.parse(eventdata['xaxis.range[0]'])) * l_this.channels.length) < config.interval[l_this.compress_level-1]*7/8) && (!l_this.compress_level_arr[l_this.compress_level]["condition"])) {
                l_this.compress_level -= 1;
                var request = new Request(l_this.time_format(eventdata['xaxis.range[0]']), l_this.time_format(eventdata['xaxis.range[1]']), l_this.channels, l_this.check_level, l_this.compress_level_arr[l_this.compress_level]["level"], l_this.httpService);
                request.execute(l_this);
                l_this.alarm_condition["disabled"][l_this.compress_level] = false;
                l_this.alarm_condition["checked"][l_this.compress_level] = true;
                l_this.alarm_condition["checked"][l_this.compress_level + 1] = false;
              }
              else if ((!l_this.auto_detalazing_condition) && (!l_this.compress_level_arr[l_this.compress_level]["condition"]) && (((Date.parse(eventdata['xaxis.range[1]']) - Date.parse(eventdata['xaxis.range[0]'])) * l_this.channels.length) >= config.interval[l_this.compress_level-1]*3/4) && (((Date.parse(eventdata['xaxis.range[1]']) - Date.parse(eventdata['xaxis.range[0]'])) * l_this.channels.length) <= config.interval[l_this.compress_level-1]*5/4)) {
                l_this.alarm_condition["disabled"][l_this.compress_level - 1] = false;
                l_this.start_arr = eventdata['xaxis.range[0]'];
                l_this.end_arr = eventdata['xaxis.range[1]'];
              }
            });
          });

         // this.start_arr = Date.parse(this.time1);
          //this.end_arr = Date.parse(this.time2);
        }
        catch(error) {
	        if(error.name=="TypeError"){
	          alert("Sorry, data not exist");
	          this.condition = false;
            this.send_condition = false;
            this.conditionChange.emit(false);
          }

        }
	    }

    }


}
