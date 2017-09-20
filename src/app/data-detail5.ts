import { Component, Input } from '@angular/core';
//import any = jasmine.any;
import {ChannelResponse} from './channel.response';
import {ParsTree} from './pars_tree'

@Component({
  selector: 'my-data-detail5',
  template:`
	<div class="detail" *ngIf="channel5">
	    <div *ngIf="channel5.data.condition">
            <ul>
                <li *ngFor="let result5 of channel5.name">
                     <div *ngIf="!result5.condition">
                         <details>
                             <summary>{{result5.name}}</summary>
                             <ul>
                                
                             </ul>
                         </details>
                     </div>     
                       <div *ngIf="result5.condition">
							<input type="checkbox" value="{{result5.name}}" (change)="setCheck(result5.name)"/> {{result5.name}}
					   </div>
                </li>                
            </ul>
         </div>
	</div>
  `,



	 providers: [ ParsTree]
})

export class DataDetail5Component {
    @Input()
	channel5: ChannelResponse;
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
			this.arr = this.parsTree.getChannel(this.channel5.data);
		}
		catch(err){
		}
  }

}
