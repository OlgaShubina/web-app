import { Component, Input } from '@angular/core';
//import any = jasmine.any;
import {ChannelResponse} from './channel.response';
import {ParsTree} from './pars_tree'

@Component({
  selector: 'my-channel-detail',
  template:`
	<div *ngIf="channel">
		<div *ngIf="channel.data.condition">
			<ul>
				<li *ngFor="let result of channel.name"> 
				
					<details>
						<summary>{{result.name}}</summary>
							<ul>
								<my-channel-detail2 [channel2]="arr[result.name]"></my-channel-detail2>
							</ul>
					</details>
				</li>
			</ul>
		
		</div>
		<div *ngIf="!channel.data.condition" class="detail">
			<ul>
				<li>Name: {{channel.name[0].name.name}}</li>
				<li>Id: {{channel.name[0].name.id}}</li>
				<li>Type: {{channel.name[0].name.type}}</li>
				<li>Units: {{channel.name[0].name.units}}</li>
				<li>Threshold: {{channel.name[0].name.threshold}}</li>
				<li>Is_log: {{channel.name[0].name.is_log}}</li>
				<li>Description: {{channel.name[0].name.description}}</li>
				<li>Cas_type: {{channel.name[0].name.cas_type}}</li>
			</ul>
		</div>
		
	</div>
  `,
	styles:[`
	.detail {
	  color: black;
	  width: 300px;
	  border-color: #888888;
	  border-style: double;
	  
	}
	.detail li{
	  padding-left: 0px;
	  margin-left: 0px;
	  list-style-type: none;
	}
  `],

	 providers: [ ParsTree]
})

export class ChannelDetailComponent {
	@Input() channel: ChannelResponse;
	@Input() condition: boolean;
	@Input() data:any;


	arr: {[id: string]: {[id: string]: any}} = {};
	constructor(private parsTree: ParsTree) {}
	ngOnInit() {
		this.arr = this.parsTree.getChannel(this.channel.data);

 	}


}
