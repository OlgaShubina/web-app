import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Response, Headers} from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {ChannelResponse} from './channel.response';
import 'rxjs/add/operator/toPromise';
import { Chunk} from './chunk'
import {Channel} from './channel'
import {config} from './config'

@Injectable()
export class HttpService{

	data: any;
	current_chunk: any;

  constructor(private http: Http){
    	this.current_chunk = 0;
	}

    getData() : Observable<Channel[]>{
        return this.http.get(config.url.channels)
						.map((resp:Response)=>{
							let channelsList = resp.json();
							return channelsList;
						})
						.catch((error: any)=> { return Observable.throw(error);});
    }

    getTemplate(obj: any) : Observable<ChannelResponse[]>{
    	const body = JSON.stringify(obj);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        return this.http.post(config.url.templates,  body, { headers: headers })
						.map((resp:Response)=>{
              var a = document.createElement('a');
              let blob = new Blob([resp.text()], [])
              let template = resp.text();
              a.href = window.URL.createObjectURL(blob);
              a.download = "script.py";
              a.click();
              let answer = {"template": template, "url": a.href};
							return answer;
						})
						.catch((error: any)=> { return Observable.throw(error);});
    }
	getFile() : Observable<ChannelResponse[]>{
    	 let headers = new Headers({ 'Mime-Type': 'aplication/octet-stream' });
        return this.http.get(config.url.templates)
						.map((resp:Response)=>{
							let template = resp;
							return template;
						})
						.catch((error: any)=> { return Observable.throw(error);});
    }
	getChunk(uuid: string, data: any): Observable<Chunk>{
		 let headers = new Headers({'Content-Type': 'application/json;charset=utf-8' });
		  const body = JSON.stringify(data);
        return this.http.post(config.url.chunk+uuid, body, { headers: headers })
			.map((resp:Response)=>{
							let chunk = resp.json();
							return chunk;
						})
						.catch((error: any)=> { return Observable.throw(error);});
    }

    private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  	}

	postData(obj: any){
        const body = JSON.stringify(obj);

        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });

        return this.http.post(config.url.data, body, { headers: headers })
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);});
    }
    postData2(obj: any){
        const body = JSON.stringify(obj);

        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });

        return this.http.post(config.url.data, body, { headers: headers })
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);});
    }
	postFile(obj: any){
        const body = JSON.stringify(obj);

        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });

        return this.http.post('downloads/file.json', body, { headers: headers })
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);});
    }
    getUuid(chunk: any){
    	return chunk.next;
	}


}
