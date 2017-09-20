import { Component, Input } from '@angular/core';
//import any = jasmine.any;
import {ChannelResponse} from './channel.response';
import {ParsTree} from './pars_tree'

@Component({
  selector: 'my-data-detail2',
  template:`
	<div class="detail" *ngIf="channel2">
		<div *ngIf="channel2.data.condition">
			<ul>
				<li *ngFor="let result2 of channel2.name">
					<div *ngIf="!result2.condition">
						<details>
							 <summary>{{result2.name}}</summary>
							 <ul>
								<my-data-detail3 [channel3]="arr[result2.name]" [checked]="checked"></my-data-detail3>
							 </ul>
						   </details>
						</div>
						<div *ngIf="result2.condition">
							<input type="checkbox" value="{{result2.name}}" (change)="setCheck(result2.name)"/> {{result2.name}}
						</div>
				</li>
				
			</ul>
		</div>
	</div>
  `,



	 providers: [ ParsTree]
})

export class DataDetail2Component {
    @Input()
	channel2: ChannelResponse;
    arr: {[id: string]: {[id: string]: any}} = {};
	constructor(private parsTree: ParsTree) {};
	@Input() checked: any[] = [];

	setCheck(element: any){
		var index = this.checked.indexOf(element);
		if (index===-1) {
			this.checked.push(element);
		}
		else{

			this.checked.splice(index, 1);

		}
	}
	ngOnInit() {
		try{
			this.arr = this.parsTree.getChannel(this.channel2.data);
		}
		catch(err){
		}
 	}
}
