import { Component, Input } from '@angular/core';
//import any = jasmine.any;
import {ChannelResponse} from './channel.response';
import {ParsTree} from './pars_tree'

@Component({
  selector: 'my-channel-detail2',
  template:`
	<div *ngIf="channel2">
		<div *ngIf="channel2.data.condition">
			<ul>
				<li *ngFor="let result2 of channel2.name">
					<details>
						 <summary>{{result2.name}}</summary>
						 <ul>
							<my-channel-detail3 [channel3]="arr[result2.name]"></my-channel-detail3>
						 </ul>
					   </details>
				</li>
				
			</ul>
		</div>
		<div class="detail" *ngIf="!channel2.data.condition"> 
			<ul>
				<li>Name: {{channel2.name[0].name.name}}</li>
				<li>Id: {{channel2.name[0].name.id}}</li>
				<li>Type: {{channel2.name[0].name.type}}</li>
				<li>Units: {{channel2.name[0].name.units}}</li>
				<li>Threshold: {{channel2.name[0].name.threshold}}</li>
				<li>Is_log: {{channel2.name[0].name.is_log}}</li>
				<li>Description: {{channel2.name[0].name.description}}</li>
				<li>Cas_type: {{channel2.name[0].name.cas_type}}</li>
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
  `],



	 providers: [ ParsTree]
})

export class ChannelDetail2Component {
    @Input()
	channel2: ChannelResponse;
    arr: {[id: string]: {[id: string]: any}} = {};
	constructor(private parsTree: ParsTree) {}
	ngOnInit() {
		try{
			this.arr = this.parsTree.getChannel(this.channel2.data);
		}
		catch(err){
		}
 	}

}
