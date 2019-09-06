import { Component, Input, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
import { Request } from './request';
import {DataComponent} from "./data.component";
import {HttpService} from './http.service';
import {PlotHTMLElement} from './interface';
import {config} from './config';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
declare let Plotly: any;
import 'rxjs/Rx';


@Component({
  selector: 'my-chart',
  template:`    
    <div class="loader" *ngIf="condition" id="wrapper">
      <div id="border">
        <div id="whitespace">
          <div id="line">
          </div>
        </div>
      </div>
    </div>
  	<div class="detail">  
        <button class="reverse" (click)="reverseChannel()">Reverse</button>
        <div class="checkbox"><input name="num_chart" id="num_chart" type="checkbox" value="{{num_chart_condition}}" [checked]="num_chart_condition" (click)="setCheck('num_chart')" disabled="true"/> Chart without time scale</div>
	      <nav class="segmented-button">
			  <input type="radio" value="one" id="seg-one" (click)="redrawChart(0)" [checked] ="cond_one_scale">
			  <label for="seg-one" class="first">one scale</label>
			  <input type="radio" value="multy" id="seg-multy" (click)="redrawChart(1)" [checked] = "multy_axis_condition">
			  <label for="seg-multy" class="last">multi scale</label>
		    </nav>   
    	<div class="checkbox"><input  type="checkbox" value="{{auto}}" (change)="setCheck('auto')"/> auto</div>        
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
	<div *ngIf="chart_condition || error_ber_condition||num_chart_condition" class="myCanvas" id="myDiv" style="width: 100%; height: 100%;"></div>
	
	<div *ngIf="table_draw_condition" width="100%" class="table_class" id="table">
    <div class="button"><button class="btn btn-default" (click)="download()">Download CSV file</button></div>
    

		<table border="1" width="970" cellpadding="5" *ngFor="let name of channels_name">
			<tr><th>{{name}}</th></tr>
			<tr>
		   		<th *ngFor="let key of table_keys">{{key}}</th>
     		</tr>
			<tr *ngFor="let data of table_arr[name]">
			  	<td *ngFor="let row of data" >{{row}}</td>
	 	</table>
	</div>

  	
  `,
  styles:[`
		.checkbox{
			float: left;
			padding-left: 20px;
			padding-right: 10px;
		}
    .button{
      float:right;
      margin-top: 1%;	
    }
		.detail{
			float: top;
			text-align: center;
      margin-top: 1%;
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
    .reverse{
      float: left;
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
    .reverse:hover{
      -moz-box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
		  -webkit-box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
		  -o-box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
		  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
		  color: #333333;
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
	@Output('conditionSendChange') conditionSendChange = new EventEmitter<boolean>();
	@Output('conditionNumChart') conditionNumChart = new EventEmitter<boolean>();
	data_arr: any[] = [];
	@Input() condition: boolean;
	@Input() graph_condition: boolean;
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
  @Input() chart_condition: boolean;
  @Input() error_ber_condition: boolean = false;
  @Input() num_chart_condition: boolean = false;
  disabled_num: boolean = false;
  multy_axis_condition: boolean = true;
  cond_one_scale: boolean = false;
  auto: string;
	data: any;
	arr: any;
	start_arr: string;
	end_arr: string;
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
          l: 50,
          r: 50,
          b: 35,
          t: 30
        },
			  legend: {
          x: 0,
          y: 100,
          orientation: "h"
        },
        xaxis: {
          autorange: true,
          rangeslider: {visible: false}
        },
        yaxis1: {
          autorange: true,
          titlefont: {color: 'rgba(3, 54, 88, 0.8)'},
          tickfont: {color: 'rgba(3, 54, 88, 0.8)'}
        }
      },{
      position: 50, margin: {
        l: 50, r: 50, b: 35, t: 30
      }, legend: {
        x: 0, y: 100, orientation: "h"
      }, xaxis: {
          autorange: true,
          rangeslider: {visible: false}
        },
      yaxis1: {
        autorange: true,
        titlefont: {color: 'rgba(3, 54, 88, 0.8)'}, tickfont: {color: 'rgba(3, 54, 88, 0.8)'}, side: 'right'
      }, yaxis2: {
        autorange: true,
        titlefont: {color: 'rgba(83, 0, 6, 0.8)'},
        tickfont: {color: 'rgba(83, 0, 6, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left'
      }
    }, {
      position: 50, margin: {
        l: 50, r: 50, b: 35, t: 30
      }, legend: {
        x: 0, y: 100, orientation: "h"
      }, xaxis: {
          autorange: true,
          rangeslider: {visible: false}
        },yaxis1: {
        autorange: true,
        titlefont: {color: 'rgba(3, 54, 88, 0.8)'}, tickfont: {color: 'rgba(3, 54, 88, 0.8)'}, side: 'right'
      }, yaxis2: {
        autorange: true,
        titlefont: {color: 'rgba(83, 0, 6, 0.8)'},
        tickfont: {color: 'rgba(83, 0, 6, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left'
      }, yaxis3: {
        autorange: true,
        titlefont: {color: 'rgba(128, 128, 0, 0.8)',},
        tickfont: {color: 'rgba(128, 128, 0, 0.8)',},
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 0.01
      }
    }, {
      position: 50, margin: {
        l: 50, r: 50, b: 35, t: 30
      }, legend: {
        x: 0, y: 100, orientation: "h"
      }, xaxis: {
          autorange: true,
          rangeslider: {visible: false}
        },yaxis1: {
        autorange: true,
        titlefont: {color: 'rgba(3, 54, 88, 0.8)'}, tickfont: {color: 'rgba(3, 54, 88, 0.8)'}, side: 'right'
      }, yaxis2: {
        autorange: true,
        titlefont: {color: 'rgba(83, 0, 6, 0.8)'},
        tickfont: {color: 'rgba(83, 0, 6, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left'
      }, yaxis3: {
        autorange: true,
        titlefont: {color: 'rgba(128, 128, 0, 0.8)',},
        tickfont: {color: 'rgba(128, 128, 0, 0.8)',},
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 0.01
      }, yaxis4: {
        autorange: true,
        titlefont: {color: 'rgba(0, 191, 255, 0.8)'},
        tickfont: {color: 'rgba(0, 191, 255, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left',
        position: 1
      }
    },{
      position: 50, margin: {
        l: 50, r: 50, b: 35, t: 30
      }, legend: {
        x: 0, y: 100, orientation: "h"
      }, xaxis: {
          autorange: true,
          rangeslider: {visible: false}
        },yaxis1: {
        autorange: true,
        titlefont: {color: 'rgba(3, 54, 88, 0.8)'}, tickfont: {color: 'rgba(3, 54, 88, 0.8)'}, side: 'right'
      },yaxis2: {
        autorange: true,
        titlefont: {color: 'rgba(83, 0, 6, 0.8)'},
        tickfont: {color: 'rgba(83, 0, 6, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left'
      }, yaxis3: {
        autorange: true,
        titlefont: {color: 'rgba(128, 128, 0, 0.8)',},
        tickfont: {color: 'rgba(128, 128, 0, 0.8)',},
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 0.01
      }, yaxis4: {
        autorange: true,
        titlefont: {color: 'rgba(0, 191, 255, 0.8)'},
        tickfont: {color: 'rgba(0, 191, 255, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left',
        position: 1
      },yaxis5: {
        autorange: true,
        titlefont: {color: 'rgba(220, 20, 60, 0.8)'},
        tickfont: {color: 'rgba(220, 20, 60, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 0.02
      }
    },{
      position: 50, margin: {
        l: 50, r: 50, b: 35, t: 30
      }, legend: {
        x: 0, y: 100, orientation: "h"
      },xaxis: {
          autorange: true,
          rangeslider: {visible: false}
        },yaxis1: {
        autorange: true,
        titlefont: {color: 'rgba(3, 54, 88, 0.8)'}, tickfont: {color: 'rgba(3, 54, 88, 0.8)'},side: 'right'
      },yaxis2: {
        autorange: true,
        titlefont: {color: 'rgba(83, 0, 6, 0.8)'},
        tickfont: {color: 'rgba(83, 0, 6, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left'
      }, yaxis3: {
        autorange: true,
        titlefont: {color: 'rgba(128, 128, 0, 0.8)',},
        tickfont: {color: 'rgba(128, 128, 0, 0.8)',},
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 0.01
      }, yaxis4: {
        autorange: true,
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
        autorange: true,
        titlefont: {color: 'rgba(205, 102, 0, 0.8)'},
        tickfont: {color: 'rgba(205, 102, 0, 0.8)'},
        anchor: 'free',
        overlaying: 'y',
        side: 'left',
        position: 0.98
      }
    }]
    constructor(public dataComponent: DataComponent, private httpService: HttpService){};


   download(){
    for (var i in this.data_arr) {
      var csvData = new Angular2Csv(this.table_arr[i], String(i), { headers: this.table_keys });
      var a = document.createElement("a");
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      var blob = new Blob([csvData], { type: 'text/csv' });
      var url= window.URL.createObjectURL(blob);
      a.href = url;
      a.download = String(i)+'.csv';
      //a.click();
    }

}
public getKeys(data){
    console.log(data)
    return Object.keys(data);
  }

  redrawChart(value: any){
    var myPlot = <PlotHTMLElement>document.getElementById('myDiv');
    //console.log(value)
    if ((value == 0) && (this.cond_one_scale==false)) {
      for (var i in myPlot.data){
        myPlot.data[i].yaxis = 'y';
        this.cond_one_scale = true;
        this.multy_axis_condition = false;
        //console.log("one", this.cond_one_scale);
      }
      var style =  this.options[0];
    }
    else if((value == 1) &&(this.cond_one_scale==true)){
      var m = 1;
      for (var i in myPlot.data){
        myPlot.data[i].yaxis = 'y'+String(m);
        m = m+1;
        this.cond_one_scale = false;
        this.multy_axis_condition = true;
      }
      var style = this.options[this.value];
    }

    Plotly.newPlot('myDiv', myPlot.data, style);
    var l_this = this;
    myPlot.on('plotly_relayout', function (eventdata: any) {
              if (((l_this.auto_detalazing_condition) && ((Date.parse(eventdata['xaxis.range[1]']) - Date.parse(eventdata['xaxis.range[0]'])) * l_this.channels.length) < config.interval[l_this.compress_level-1]*7/8) && (!l_this.compress_level_arr[l_this.compress_level]["condition"])) {
                l_this.compress_level -= 1;
                l_this.condition = true;
                l_this.conditionChange.emit(true);
                //console.log("request3");
                var request = new Request(l_this.time_format(eventdata['xaxis.range[0]']), l_this.time_format(eventdata['xaxis.range[1]']), l_this.channels, l_this.check_level, l_this.compress_level_arr[l_this.compress_level]["level"], l_this.httpService);
                request.execute(l_this);
                l_this.alarm_condition["disabled"][l_this.compress_level] = false;
                l_this.alarm_condition["checked"][l_this.compress_level] = true;
                l_this.alarm_condition["checked"][l_this.compress_level+1] = false;
              }
              else if ((!l_this.auto_detalazing_condition) && (!l_this.compress_level_arr[l_this.compress_level]["condition"]) && (((Date.parse(eventdata['xaxis.range[1]']) - Date.parse(eventdata['xaxis.range[0]'])) * l_this.channels.length) <= config.interval[l_this.compress_level-1]*5/4)) {
                l_this.alarm_condition["disabled"][l_this.compress_level - 1] = false;
                l_this.start_arr = l_this.time_format(eventdata['xaxis.range[0]']);
                l_this.end_arr = l_this.time_format(eventdata['xaxis.range[1]']);
              }
    });
   // Plotly.deleteTraces('graphDiv');
    //Plotly.relayout(myPlot, style);
    //Plotly.restyle(myPlot, style);

//    Plotly.redraw(myPlot);
    //console.log(myPlot.data);
  }

	setCheck(value: string){
    if(value=='auto'){
      this.auto_detalazing_condition=!this.auto_detalazing_condition;
      $("input:checkbox").prop('checked', $('#num_chart').prop('checked'));
    }
    else{
      if(this.num_chart_condition==false && this.channels.length!==2){
        alert("Сhoose two channels");
        $('input[name="num_chart"]:checked').prop('checked', false);

      }
      else if(this.num_chart_condition==false && this.compress_level==0) {
        alert("Enter a larger period of time");
        $('input[name="num_chart"]:checked').prop('checked', false);
      }
      else{
        this.num_chart_condition = !this.num_chart_condition;
        this.conditionNumChart.emit(this.num_chart_condition);
      }
    }
	}
	reverseChannel(){
    this.channels.reverse();
    this.createDataChart();
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
		 if((time.split(":").length-1)==1){
       time = String(time)+":00.00000";
     }
     else if(time.indexOf(".")==-1){
        time = String(time)+".00000";
     }
     return time
	 }

	 reloadData(level: number){
	    if(this.start_arr==null){
	      this.start_arr = this.time1;
        this.end_arr = this.time2;

      }
	 		if(this.auto_detalazing_condition){

	 		  this.compress_level = level;
	 		  this.createDataChart();
			}
	 		else if(level<this.compress_level){
	 		  //this.condition = false;
	 			this.compress_level = level;
	 			if(this.time_arr[this.compress_level]){
	 			  this.createDataChart();
        }
        else{
	 			  this.condition = true;
          this.conditionChange.emit(true);
          //console.log("request2");
          var request = new Request(this.time_format(this.start_arr), this.time_format(this.end_arr), this.channels, this.check_level, this.compress_level_arr[this.compress_level]["level"], this.httpService);
          request.execute(this);
          //this.alarm_condition["disabled"][this.compress_level-1] = true;
        }
			}
			else{
	 			this.compress_level = level;
	 			if(this.time_arr[this.compress_level]){
	 			  this.createDataChart();
        }
	 			else{
	 			  this.condition = true;
          this.conditionChange.emit(true);
         // console.log("request4")
          var request = new Request(this.time_format(this.start_arr), this.time_format(this.end_arr), this.channels, this.check_level, this.compress_level_arr[this.compress_level]["level"], this.httpService);
          request.execute(this);
        }

			}
	}

	ngOnChanges(){
	   //console.log(this.cond_one_scale, this.multy_axis_condition);
		if(this.send_condition==true){
		 // console.log("request1");
			var request = new Request(this.time1,this.time2, this.channels, this.check_level, this.compress_level_arr[this.compress_level]["level"], this.httpService);
			request.execute(this);
			this.send_condition = false;
		}
		else if(this.condition != true){
     // console.log("changes");
		  this.createDataChart();
		  if(this.table_draw_condition==true){
		    this.condition = false;
        this.conditionChange.emit(false);
		     $(document).ready(function () {
		        document.getElementById('table').style.height=window.innerHeight-110+"px";
            document.getElementById('table').style.width=window.innerWidth-400+"px";
            window.onresize = function(){
              document.getElementById('table').style.height=window.innerHeight-110+"px";
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
      this.graph_condition = true;
	}
   createDataChart(){
	    if(this.graph_condition) {
	      try {
	        this.condition = false;
          this.conditionChange.emit(false);
	        var double_arr: {[id:string]: any} = {};
          var labels: string[] = [];
          var name_channels: string[] = [];
          this.table_keys = ['time'];
          var m = 1;
          $('input[name="num_chart"]:disabled').prop('disabled', false);
          this.data_arr = this.time_arr[this.compress_level];
          for (var key in this.data_arr) {
            name_channels.push(key);
          }
          this.channels_name = name_channels;
          if (typeof(this.data_arr[name_channels[0]][0][Object.keys(this.data_arr[name_channels[0]][0])[0]]) === 'object') {
            this.table_keys = ['time'].concat(Object.keys(this.data_arr[name_channels[0]][0][Object.keys(this.data_arr[name_channels[0]][0])[0]]))
            console.log(this.table_keys)
          }
          else {
            this.table_keys = ['time'].concat(['value'])
          }
          // for (var key in this.data_arr[name_channels[0]][0]) {
          //   console.log(this.data_arr[name_channels[0]][0])
          //   this.table_keys.push(key);
          // }
          for (var i in this.data_arr[name_channels[0]]) {
            labels.push(this.data_arr[name_channels[0]][i].time);
          }
          var cur: any[] = [];
          this.cond_one_scale = false;
          this.multy_axis_condition = true;
          for (var i in this.data_arr) {
            let c_arr: any[] = [];
            var x: any[] = [];
            var y: any[] = [];
            var error1: any[] = [];
            var error2: any[] = [];
            var all_data: any[] = [];
            for (var k in this.data_arr[i]) {
              let arr: any[] = [];
              arr.push(Object.keys(this.data_arr[i][k])[0])
              if (this.raw_condition) {
                arr.push(Object.values(this.data_arr[i][k])[0])
              }
              else {
                for (let x in Object.values(this.data_arr[i][k])[0]) {
                arr.push(Object.values(this.data_arr[i][k])[0][x]);
              }
              }

              c_arr.push(arr);
              this.raw_condition = this.compress_level_arr[this.compress_level]["condition"];

              if (this.raw_condition) {
                x.push(Object.keys(this.data_arr[i][k])[0]);
                y.push(Object.values(this.data_arr[i][k])[0]);
              }
              else if (this.check_method == "chart") {
                x.push(Object.keys(this.data_arr[i][k])[0]);
                y.push(Object.values(this.data_arr[i][k])[0][this.field]);
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
                    x.push(Object.keys(this.data_arr[i][k])[0]);
                    y.push(Object.values(this.data_arr[i][k])[0]["avg"]);
                    error1.push(Object.values(this.data_arr[i][k])[0]["max"] - Object.values(this.data_arr[i][k])[0]["avg"]);
                    error2.push(Object.values(this.data_arr[i][k])[0]["avg"] - Object.values(this.data_arr[i][k])[0]["min"]);
                    break;
                  case "avg_sigma":
                    x.push(Object.keys(this.data_arr[i][k])[0]);
                    y.push(Object.values(this.data_arr[i][k])[0]["avg"]);
                    error1.push(Object.values(this.data_arr[i][k])[0]["sigma"]);
                    error2.push(Object.values(this.data_arr[i][k])[0]["sigma"]);
                    break;
                  case "mediana":
                    x.push(Object.keys(this.data_arr[i][k])[0]);
                    y.push(Object.values(this.data_arr[i][k])[0]["mediana"]);
                    error1.push(Object.values(this.data_arr[i][k])[0]["max"] - Object.values(this.data_arr[i][k])[0]["mediana"]);
                    error2.push(Object.values(this.data_arr[i][k])[0]["mediana"] - Object.values(this.data_arr[i][k])[0]["min"]);
                    break;
                  case "mediana_sigma":
                    x.push(Object.keys(this.data_arr[i][k])[0]);
                    y.push(Object.values(this.data_arr[i][k])[0]["mediana"]);
                    error1.push(Object.values(this.data_arr[i][k])[0]["sigma"]);
                    error2.push(Object.values(this.data_arr[i][k])[0]["sigma"]);
                    break;
                  case "center_bound":
                    x.push(Object.keys(this.data_arr[i][k])[0]);
                    y.push(Object.values(this.data_arr[i][k])[0]["center"]);
                    error1.push(Object.values(this.data_arr[i][k])[0]["right_bound"]);
                    error2.push(Object.values(this.data_arr[i][k])[0]["left_bound"]);
                    break;
                  case "most_freq_bound":
                    x.push(Object.keys(this.data_arr[i][k])[0]);
                    y.push(Object.values(this.data_arr[i][k])[0]["most_freq"]);
                    error1.push(Object.values(this.data_arr[i][k])[0]["right_bound"]);
                    error2.push(Object.values(this.data_arr[i][k])[0]["left_bound"]);
                    break;
                }
              }

            }
            if(this.num_chart_condition){
                double_arr[i] = y;
              }
            this.table_arr[i] = c_arr;
            if((this.check_method=="error_bar")&&(this.check_level=="data_sampler")){
              cur.push({
              x: x, close: error1, high: y,
                line: {color: this.borderColor[m-1]},
                increasing: {line: {color: this.borderColor[m-1]}},
                decreasing: {line: {color: this.borderColor[m-1]}},
                low: y,
                open: error2,
                name: i, type: 'ohlc', xaxis: 'x', yaxis: "y" + String(m)});
            }
            else {
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
            }
            m = m + 1;
          }
          let local_this = this;
          //console.log(cur);

          //console.log(cur);
          //console.log(double_arr);
          var layout = this.options[this.value];
          if(this.num_chart_condition){
            cur = [];
            cur.push({
              x: double_arr[this.channels[0]], y: double_arr[this.channels[1]], name: this.channels[0]+'-'+this.channels[1], pointRadius: 1, yaxis: "y1" , type: 'scatter', mode: 'markers', line: {color: this.borderColor[0]}, marker: {size: 5}
            });
            layout = {
              position: 50,
              margin: {
                l: 50,
                r: 50,
                b: 35,
                t: 30
              },
              legend: {
                x: 0,
                y: 100,
                orientation: "h"
              },
              xaxis: {
                autorange: true,
                rangeslider: {visible: false},
                title: this.channels[0]
              },
              yaxis1: {
                autorange: true,
                titlefont: {color: 'rgba(3, 54, 88, 0.8)'},
                tickfont: {color: 'rgba(3, 54, 88, 0.8)'},
                title: this.channels[1]
              }
            };
          }
          if(this.table_draw_condition!=true) {
            $(document).ready(function () {
              document.getElementById('myDiv').style.height = window.innerHeight - 120 + "px";
              document.getElementById('myDiv').style.width = window.innerWidth - 400 + "px";
              window.onresize = function () {
                document.getElementById('myDiv').style.height = window.innerHeight - 120 + "px";
                document.getElementById('myDiv').style.width = window.innerWidth - 400 + "px";
              };
              Plotly.newPlot('myDiv', cur, layout);

              var myPlot = <PlotHTMLElement>document.getElementById('myDiv');
              let l_this = local_this;
              local_this.send_condition = false;
              local_this.condition = false;
              local_this.conditionChange.emit(false);
              local_this.conditionSendChange.emit(false);


              myPlot.on('plotly_relayout', function (eventdata: any) {
                if (((l_this.auto_detalazing_condition) && ((Date.parse(eventdata['xaxis.range[1]']) - Date.parse(eventdata['xaxis.range[0]'])) * l_this.channels.length) < config.interval[l_this.compress_level - 1] * 7 / 8) && (!l_this.compress_level_arr[l_this.compress_level]["condition"])) {
                  l_this.compress_level -= 1;
                  l_this.condition = true;
                  l_this.conditionChange.emit(true);
                  //console.log("request3");
                  var request = new Request(l_this.time_format(eventdata['xaxis.range[0]']), l_this.time_format(eventdata['xaxis.range[1]']), l_this.channels, l_this.check_level, l_this.compress_level_arr[l_this.compress_level]["level"], l_this.httpService);
                  request.execute(l_this);
                  l_this.alarm_condition["disabled"][l_this.compress_level] = false;
                  l_this.alarm_condition["checked"][l_this.compress_level] = true;
                  l_this.alarm_condition["checked"][l_this.compress_level + 1] = false;
                }
                else if ((!l_this.auto_detalazing_condition) && (!l_this.compress_level_arr[l_this.compress_level]["condition"]) && (((Date.parse(eventdata['xaxis.range[1]']) - Date.parse(eventdata['xaxis.range[0]'])) * l_this.channels.length) <= config.interval[l_this.compress_level - 1] * 5 / 4)) {
                  l_this.alarm_condition["disabled"][l_this.compress_level - 1] = false;
                  l_this.start_arr = l_this.time_format(eventdata['xaxis.range[0]']);
                  l_this.end_arr = l_this.time_format(eventdata['xaxis.range[1]']);
                }
              });
            });
          }
           // this.start_arr = Date.parse(this.time1);
            //this.end_arr = Date.parse(this.time2);
        }
        catch(error) {
	        if(error.name=="TypeError"){
	          alert("Sorry, data not exist");
	          console.log(error);
            this.condition = false;
            this.conditionChange.emit(false);
          }

        }
	    }

    }


}
