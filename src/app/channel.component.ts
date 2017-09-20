import { Component, OnInit} from '@angular/core';
import { HttpService} from './http.service';
import 'rxjs/add/operator/map';
import {ChannelDetailComponent} from './channel-detail.component';
import {ChannelResponse} from './channel.response';
import {ParsTree} from './pars_tree'

@Component({
    selector: 'my-app',
    template: `
			   <div class="main_channels">
			   		<ul class="channels">				 
						 <li *ngFor="let channel of channels"
						   [class.selected]="channel === selectedChannel"
						   (click)="onSelect(channel)">						  
						   <details>
							 <summary>{{channel}}</summary>
							 <ul>
								<my-channel-detail [channel]="arr[channel]" [data]="data"></my-channel-detail>
							 </ul>
						   </details>						   
						 </li>
					   </ul>		
				</div>
			   	   
				 
			   `,

	styles:[`
	  .selected {
		background-color: #DCD0C0 !important;
		color: #373737;
	  }
	  .main_channels{
	  	padding-top: 70px;
	  }
	  .channels {
		margin: 0 0 2em 0;
		list-style-type: none;
		padding: 0;
		min-width: 20em;
		max-width: 60em;
	  }
	  .channels li {
		cursor: pointer;
		position: relative;
		left: 0;
		background-color: #DCD0C0;
		margin: .3em;
		padding: .2em 0;
		min-height: 1.2em;
		border-radius: 4px;
	  }
	  .channels li.selected:hover {
		background-color: #DCD0C0 !important;
		color: #373737;
	  }
	  .channels li:hover {
		color: #373737;
		background-color: #DDD;
		left: .2em;
	  }
	  .channels .text {
		position: relative;
		top: -3px;
	  }
	  .channels .badge {
		display: inline-block;
		font-size: small;
		color: white;
		padding: 0.8em 0.7em 0 0.7em;
		background-color:#DCD0C0;
		line-height: 1em;
		position: relative;
		left: -1px;
		top: -4px;
		min-height: 1.8em;
		margin-right: .8em;
		border-radius: 4px 0 0 4px;
	  }
	`],

    providers: [HttpService, ParsTree]
})
export class ChannelComponent implements OnInit {
	channelsresponse: any[] = [];
	arr: {[id: string]: {[id: string]: any}} = {};
	channels: string[] = [];
	error: any;
	selectedChannel: string;

	constructor(private httpService: HttpService, private parsTree: ParsTree) {
	}

	ngOnInit() {
		this.httpService.getData()
            .subscribe(
				data => {
					this.channelsresponse = data;
					this.arr = this.parsTree.getChannel(data);
					for (var key in this.channelsresponse) {
						this.channels.push(key);
					}
				},
				error => {
					this.error = error;
				}
			);
	}

	onSelect(channel: string) {
		this.selectedChannel = channel;
	}

}
