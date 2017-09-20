import { Component, Input } from '@angular/core';
//import any = jasmine.any;
import {ChannelResponse} from './channel.response';
import {ParsTree} from './pars_tree'

@Component({
  selector: 'my-channel-detail3',
  template:`
	<div  *ngIf="channel3">
		<div *ngIf="channel3.data.condition">
			<ul>
				<li *ngFor="let result3 of channel3.name">
					<details>
						 <summary>{{result3.name}}</summary>
						 <ul>
							<my-channel-detail4 [channel4]="arr[result3.name]"></my-channel-detail4>
						 </ul>
					   </details>
				</li>
				
			</ul>
		</div>
		<div class="detail" *ngIf="!channel3.data.condition"> 
			<ul>
				<li>Name: {{channel3.name[0].name.name}}</li>
				<li>Id: {{channel3.name[0].name.id}}</li>
				<li>Type: {{channel3.name[0].name.type}}</li>
				<li>Units: {{channel3.name[0].name.units}}</li>
				<li>Threshold: {{channel3.name[0].name.threshold}}</li>
				<li>Is_log: {{channel3.name[0].name.is_log}}</li>
				<li>Description: {{channel3.name[0].name.description}}</li>
				<li>Cas_type: {{channel3.name[0].name.cas_type}}</li>
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

export class ChannelDetail3Component {
    @Input()
	channel3: ChannelResponse;
    arr: {[id: string]: {[id: string]: any}} = {};
	constructor(private parsTree: ParsTree) {}
    ngOnInit() {
        try{
			this.arr = this.parsTree.getChannel(this.channel3.data);
		}
		catch(err){
		}
	}

}
