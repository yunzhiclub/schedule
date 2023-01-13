import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ScheduleRoutingModule} from './schedule-routing.module';
import { AddComponent } from './add/add.component';
import {ReactiveFormsModule} from '@angular/forms';
import {YzMaskModule} from "../../common/yz-mask/yz-mask.module";
import {YzModalModule} from "../../common/yz-modal/yz-modal.module";



@NgModule({
  declarations: [AddComponent],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    ReactiveFormsModule,
    YzMaskModule,
    YzModalModule,
  ]
})
export class ScheduleModule { }
