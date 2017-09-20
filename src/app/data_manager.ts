import { Component, OnInit, Input, SimpleChanges, HostListener } from '@angular/core';
import { Response} from '@angular/http';

@Component({
    selector: 'data-manager',
    template: `   <h1>{{time1}}</h1>
    `
})

export class DataManager implements OnInit {
    time1: string = "hello";
    time2: string;
    compress_method: string;
    compress_level: number;
    constructor(){
        console.log("constructor");
    }
    ngOnInit(){

    }
    set_properties(time1: string, time2: string, compress_method: string, compress_level: number){
        this.time1 = time1;
        this.time2 = time2;
        this.compress_method = compress_method;
        this.compress_level = compress_level;

    }
}
