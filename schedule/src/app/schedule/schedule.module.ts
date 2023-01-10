import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ScheduleRoutingModule} from './schedule-routing.module';
import { AddComponent } from './add/add.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [AddComponent],
    imports: [
        CommonModule,
        ScheduleRoutingModule,
        ReactiveFormsModule
    ]
})
export class ScheduleModule { }
