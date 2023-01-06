import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LayoutModule} from './part/layout/layout.module';
import { ScheduleComponent } from './schedule/schedule.component';
import { ClazzScheduleComponent } from './clazz-schedule/clazz-schedule.component';

@NgModule({
  declarations: [
    AppComponent,
    ScheduleComponent,
    ClazzScheduleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
