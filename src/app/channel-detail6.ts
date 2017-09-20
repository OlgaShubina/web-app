import { Component, Input } from '@angular/core';
//import any = jasmine.any;
import {ChannelResponse} from './channel.response';
import {ParsTree} from './pars_tree'

@Component({
  selector: 'my-channel-detail6',
  template:`
	<div class="detail" *ngIf="channel6">
		<ul>
			<li>Name: {{channel6.name[0].name.name}}</li>
			<li>Id: {{channel6.name[0].name.id}}</li>
			<li>Type: {{channel6.name[0].name.type}}</li>
			<li>Units: {{channel6.name[0].name.units}}</li>
			<li>Threshold: {{channel6.name[0].name.threshold}}</li>
			<li>Is_log: {{channel6.name[0].name.is_log}}</li>
			<li>Description: {{channel6.name[0].name.description}}</li>
			<li>Cas_type: {{channel6.name[0].name.cas_type}}</li>
		</ul>
	</div>
  `,
    styles:[`
	.detail {
	  color: black;
	  width: 500px;
	  border-color: #888888;
	  border-style: double;
	}
  `],



	 providers: [ ParsTree]
})

export class ChannelDetail6Component {
    @Input()
	channel6: ChannelResponse;
  ngOnInit() {
  }

}
