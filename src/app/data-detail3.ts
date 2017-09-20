import { Component, Input } from '@angular/core';
//import any = jasmine.any;
import {ChannelResponse} from './channel.response';
import {ParsTree} from './pars_tree'

@Component({
  selector: 'my-data-detail3',
  template:`
	<div class="detail" *ngIf="channel3">
		<div *ngIf="channel3.data.condition">
			<ul>
				<li *ngFor="let result3 of channel3.name">
				    <div *ngIf="!result3.condition">
                        <details>
                             <summary>{{result3.name}}</summary>
                             <ul>
                                <my-data-detail4 [channel4]="arr[result3.name]" [checked]="checked"></my-data-detail4>
                             </ul>
                           </details>
                    </div>
					    <div *ngIf="result3.condition">
							<input type="checkbox" value="{{result3.name}}" (change)="setCheck(result3.name)"/> {{result3.name}}
					    </div>
				</li>
				
			</ul>
		</div>
	</div>
  `,



	 providers: [ ParsTree]
})

export class DataDetail3Component {
    @Input()
	channel3: ChannelResponse;
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
			this.arr = this.parsTree.getChannel(this.channel3.data);
		}
		catch(err){
		}
  }

}
