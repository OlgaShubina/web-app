import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { HttpModule }   from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { DataComponent }   from './data.component';
import { HomeComponent }   from './home.component';
import { ChannelComponent } from './channel.component';
import { ChannelDetailComponent } from './channel-detail.component';
import { ChannelDetail2Component } from './channel-detail2';
import { ChannelDetail3Component } from './channel-detail3';
import { ChannelDetail4Component } from './channel-detail4';
import { ChannelDetail5Component } from './channel-detail5';
import { ChannelDetail6Component } from './channel-detail6';
import { DataDetailComponent } from './data-detail';
import { DataDetail2Component } from './data-detail2';
import { DataDetail3Component } from './data-detail3';
import { DataDetail4Component } from './data-detail4';
import { DataDetail5Component } from './data-detail5';
import {DataManager} from './data_manager';
import {Options} from './options';

const appRoutes: Routes =[
    { path: '', component: HomeComponent},
    { path: 'data', component: DataComponent},
	  { path: 'channel', component: ChannelComponent },
	  { path: 'detail/:id', component: ChannelDetailComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    ChannelComponent,
    HomeComponent,
    DataComponent,
    ChannelDetailComponent,
    ChannelDetailComponent,
    ChannelDetail2Component,
    ChannelDetail3Component,
    ChannelDetail4Component,
    ChannelDetail5Component,
    ChannelDetail6Component,
    DataDetailComponent,
    DataDetail2Component,
    DataDetail3Component,
    DataDetail4Component,
    DataDetail5Component,
    DataManager,
    Options
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
