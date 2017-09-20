import { Component, Input } from '@angular/core';
//import any = jasmine.any;
import {ChannelResponse} from './channel.response';
import {ParsTree} from './pars_tree'

@Component({
  selector: 'my-channel-detail4',
  template:`
	<div  *ngIf="channel4">
		<div *ngIf="channel4.data.condition">
			<ul>
				<li *ngFor="let result4 of channel4.name">
					 <details>
						 <summary>{{result4.name}}</summary>
						 <ul>
							<my-channel-detail5 [channel5]="arr[result4.name]"></my-channel-detail5>
						 </ul>
					   </details>
				</li>
				
			</ul>
		</div>
		<div class="detail" *ngIf="!channel4.data.condition"> 
			<ul>
				<li>Name: {{channel4.name[0].name.name}}</li>
				<li>Id: {{channel4.name[0].name.id}}</li>
				<li>Type: {{channel4.name[0].name.type}}</li>
				<li>Units: {{channel4.name[0].name.units}}</li>
				<li>Threshold: {{channel4.name[0].name.threshold}}</li>
				<li>Is_log: {{channel4.name[0].name.is_log}}</li>
				<li>Description: {{channel4.name[0].name.description}}</li>
				<li>Cas_type: {{channel4.name[0].name.cas_type}}</li>				
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

export class ChannelDetail4Component {
    @Input()
	channel4: ChannelResponse;
    arr: {[id: string]: {[id: string]: any}} = {};
	constructor(private parsTree: ParsTree) {}
    ngOnInit() {
        try{
			this.arr = this.parsTree.getChannel(this.channel4.data);
		}
		catch(err){
		}
	}

}
