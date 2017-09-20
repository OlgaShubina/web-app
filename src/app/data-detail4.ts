import { Component, Input } from '@angular/core';
//import any = jasmine.any;
import {ChannelResponse} from './channel.response';
import {ParsTree} from './pars_tree'

@Component({
  selector: 'my-data-detail4',
  template:`
	<div class="detail" *ngIf="channel4">
		<div *ngIf="channel4.data.condition">
			<ul>
				<li *ngFor="let result4 of channel4.name">
				     <div *ngIf="!result4.condition">
                         <details>
                             <summary>{{result4.name}}</summary>
                             <ul>
                                <my-data-detail5 [channel5]="arr[result4.name]" [checked]="checked"></my-data-detail5>
                             </ul>
                           </details>
                     </div>
					    <div *ngIf="result4.condition">
							<input type="checkbox" value="{{result4.name}}" (change)="setCheck(result4.name)"/> {{result4.name}}
					    </div>
				</li>
				
			</ul>
		</div>		
	</div>
  `,



	 providers: [ ParsTree]
})

export class DataDetail4Component {
    @Input()
	channel4: ChannelResponse;
    arr: {[id: string]: {[id: string]: any}} = {};
	constructor(private parsTree: ParsTree) {}
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
			this.arr = this.parsTree.getChannel(this.channel4.data);
		}
		catch(err){
		}
  }

}
