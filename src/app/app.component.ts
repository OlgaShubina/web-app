import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  template: `
        <div class="head" id="head" style="width:100%;">
            <img src="{{src_image}}">
            <h1>VEPP-2000 Data Access Interface</h1>    
            <nav>
              <a routerLink="/channel" routerLinkActive="active">Channel</a>
              <a routerLink="/data" routerLinkActive="active">Data</a>
            </nav>
        </div>
        <div>
            <router-outlet></router-outlet>
        </div>
   
  `
})
export class AppComponent {
  src_image: string;
  constructor(){
    this.src_image = '/assets/logo2.jpg';

  }
  ngOnInit(){
     document.getElementById('head').style.width=window.innerWidth*0.99+"px";
     window.onresize = function(){
      document.getElementById('head').style.width=window.innerWidth*0.99+"px";
    };
  }
}
