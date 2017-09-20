import { Component, Input } from '@angular/core';
//import any = jasmine.any;
import {ChannelResponse} from './channel.response';
import {ParsTree} from './pars_tree'

@Component({
  selector: 'my-channel-detail5',
  template:`
	<div  *ngIf="channel5">
	    <div *ngIf="channel5.data.condition">
            <ul>
                <li *ngFor="let result5 of channel5.name">
                     <details>
                         <summary>{{result5.name}}</summary>
                         <ul>
                            <my-channel-detail6 [channel6]="arr[result5.name]"></my-channel-detail6>
                         </ul>
                       </details>
                </li>                
            </ul>
         </div>
		<div class="detail" *ngIf="!channel5.data.condition"> 
			<ul>
				<li>Name: {{channel5.name[0].name.name}}</li>
				<li>Id: {{channel5.name[0].name.id}}</li>
				<li>Type: {{channel5.name[0].name.type}}</li>
				<li>Units: {{channel5.name[0].name.units}}</li>
				<li>Threshold: {{channel5.name[0].name.threshold}}</li>
				<li>Is_log: {{channel5.name[0].name.is_log}}</li>
				<li>Description: {{channel5.name[0].name.description}}</li>
				<li>Cas_type: {{channel5.name[0].name.cas_type}}</li>
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

export class ChannelDetail5Component {
    @Input()
	channel5: ChannelResponse;
    arr: {[id: string]: {[id: string]: any}} = {};
	constructor(private parsTree: ParsTree) {}
    ngOnInit() {
        try{
			this.arr = this.parsTree.getChannel(this.channel5.data);
		}
		catch(err){
		}
	}

}
