import {Chunk} from './chunk'
import { HttpService} from './http.service';
import {DataComponent} from './data.component'
import {Options} from './options'

export class Request{
    time1: string;
    time2: string;
    channels: number[];
    field: string;
    level: string;
    data: Chunk[];
    head: any;
    subscribers: any[] = [];

    constructor(time1: string, time2: string, channels: number[], field: string, level: string, private httpService: HttpService){
        this.time1 = time1;
        this.time2 = time2;
        this.channels = channels;
        this.field = field;
        this.level = level;
        this.data = [];
        this.head = {"fields" : this.field, "level" : this.level}

    }
    execute(func: any){
        console.log("request");
        this.sub(func);
        let l_this = this;
        l_this.httpService.postData2({t1:this.time1, t2:this.time2, channels:this.channels, fields: this.field, level: this.level}).subscribe(
            (data)=>{
                l_this.get_next_chunk(data.first.uuid);
            }
        );
    }
     notify_subscribers()
    {
        var local_this = this;
        console.log("request2");
        for(var i in this.subscribers){
          console.log(this.data)
          this.subscribers[i].createPointChart(this.data, this.subscribers[i]);
           this.subscribers[i].createDataChart();
        }
    }
    sub(event: any){
        this.subscribers.push(event);
    }
    get_next_chunk(uuid: string){
        console.log("request3");
        let local_this = this;
        local_this.httpService.getChunk(uuid, this.head).subscribe(chunk=>{
            local_this.on_new_chunk(chunk);
        });
    }

    on_new_chunk(chunk: any){
        let local2_this = this;
        console.log("request4");
        local2_this.data.push(chunk);
        if(chunk.next!="None"){
            local2_this.get_next_chunk(chunk.next)
        }
        else {
            this.notify_subscribers();
        }
    }
}
