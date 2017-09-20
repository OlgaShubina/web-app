import { Component, Input } from '@angular/core';
import { Channel } from './channel';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
//import any = jasmine.any;
import {ChannelResponse} from './channel.response';

export class ParsTree {
	arr: {[id: string]: {[id: string]: any}} = {};
    selectedChannel: string;
	bufchannel: ChannelResponse = new ChannelResponse();
	condition: boolean = true;

	setConditionFalse(){
		this.condition=false;
	}

	setConditionTrue(){
		this.condition=true;
	}

    getChannel(channelsresponse: any[]=[]){
      let array_name = Object.keys(channelsresponse).sort();
			let buff: any[] = [];
			for(let i = 0; i<array_name.length; i++){
			  buff[array_name[i]] = channelsresponse[array_name[i]];
      }
      channelsresponse = buff;
		for( var key in channelsresponse){
			var resultlist: any[]=[];
			var data: any[] = [];
			var resultdata: {[id: string]: any} = {};
			var data: any[] = [];

			data = channelsresponse[key];

			for (var i in data){
				if(Array.isArray(data[i])){
				resultlist.push({name:data[i][0]["name"], condition:true});
				resultdata[data[i][0]["name"]] = [{id: data[i][0]["id"], name: data[i][0]["name"], type: data[i][0]["type"], units: data[i][0]["units"], threshold: data[i][0]["threshold"], is_log : data[i][0]["is_log"], description: data[i][0]["description"], cas_type : data[i][0]["cas_type"]}];
				resultdata["condition"] = true;
			  }
				else if(typeof data[i]==="object"){
					for(var k in data[i])
						if(k==="id"||k==="name"||k==="type"||k==="units"||k==="threshold"||k==="cas_type"||k==="is_log"||k==="description"){
							resultlist.push({name: data[i], condition:false});
							resultdata[k] = ["end"];
							resultdata["condition"] = false;
						}
						else{
							resultlist.push({name:k, condition:false});
							resultdata[k] = data[i][k];
							resultdata["condition"] = true;
						}
				}
			}
			this.arr[key] = {name: resultlist, data: resultdata};
		}
		return this.arr;
	}
}
