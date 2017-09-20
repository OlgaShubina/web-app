import { Component, Input } from '@angular/core';
//import any = jasmine.any;
import {ChannelResponse} from './channel.response';
import {ParsTree} from './pars_tree'

@Component({
  selector: 'my-data-detail',
  template:`
	<div class="detail" *ngIf="channel">
		<div *ngIf="channel.data.condition">
			<ul>
				<li *ngFor="let result of channel.name"> 
				    <div *ngIf="!result.condition">
					    <details>
						<summary>{{result.name}}</summary>
							<ul>
								<my-data-detail2 [channel2]="arr[result.name]" [checked]="checked"></my-data-detail2>
							</ul>
					    </details>
					</div>
					<div *ngIf="result.condition">
						<input type="checkbox" value="{{result.name}}" (change)="setCheck(result.name)"/> {{result.name}}
					</div>
				</li>
			</ul>		
		</div>	
		
	</div>
  `,

	 providers: [ ParsTree]
})

export class DataDetailComponent {
	@Input()
	channel: ChannelResponse;
	@Input() checked: any[] = []

	setCheck(element: any){
		var index = this.checked.indexOf(element);
		if (index===-1) {
			this.checked.push(element);
		}
		else{

			this.checked.splice(index, 1);

		}
	}

	arr: {[id: string]: {[id: string]: any}} = {};
	constructor(private parsTree: ParsTree) {}
	ngOnInit() {
		this.arr = this.parsTree.getChannel(this.channel.data);
 	}
}
