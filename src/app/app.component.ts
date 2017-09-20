import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  template: `
        <div class="head">
            <img src="{{logo2}}">
            <h1>VEPP-2000 Data Access Interface</h1>    
            <nav>
              <a routerLink="/channel" routerLinkActive="active">Channel</a>
              <a routerLink="/data" routerLinkActive="active">Data</a>
            </nav>
            <router-outlet></router-outlet>
        </div>
   
  `
})
export class AppComponent {}
