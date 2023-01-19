import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ScheduleRoutingModule} from './schedule-routing.module';
import { AddComponent } from './add/add.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {YzMaskModule} from "../../common/yz-mask/yz-mask.module";
import {YzModalModule} from "../../common/yz-modal/yz-modal.module";
import { EditComponent } from './edit/edit.component';
import { EditClazzesAndTeachersComponent } from './edit/edit-clazzes-and-teachers/edit-clazzes-and-teachers.component';



@NgModule({
  declarations: [AddComponent, EditComponent, EditClazzesAndTeachersComponent],
    imports: [
        CommonModule,
        ScheduleRoutingModule,
        ReactiveFormsModule,
        YzMaskModule,
        YzModalModule,
        FormsModule,
    ]
})
export class ScheduleModule { }
