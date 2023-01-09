import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LayoutModule} from './part/layout/layout.module';
import { ScheduleComponent } from './schedule/schedule.component';
import { TimetableComponent } from './timetable/timetable.component';
import {PipeModule} from './pipe/pipe.module';
import {ApiProModule} from '../api/api.pro.module';
import {HttpClientModule} from '@angular/common/http';
import { ClazzSelectComponent } from '../common/clazz-select/clazz-select.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ScheduleComponent,
    TimetableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    PipeModule,
    ApiProModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
