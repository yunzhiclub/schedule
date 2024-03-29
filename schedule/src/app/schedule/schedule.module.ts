import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ScheduleRoutingModule} from './schedule-routing.module';
import { AddComponent } from './add/add.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {YzMaskModule} from '../../common/yz-mask/yz-mask.module';
import {YzModalModule} from '../../common/yz-modal/yz-modal.module';
import { EditComponent } from './edit/edit.component';
import { TableComponent } from './table/table.component';
import { EditClazzesAndTeachersComponent } from './edit/edit-clazzes-and-teachers/edit-clazzes-and-teachers.component';
import {NgSelectModule} from '@ng-select/ng-select';



@NgModule({
  declarations: [AddComponent, EditComponent, EditClazzesAndTeachersComponent, TableComponent],
    imports: [
        CommonModule,
        ScheduleRoutingModule,
        ReactiveFormsModule,
        YzMaskModule,
        YzModalModule,
        FormsModule,
        NgSelectModule
    ]
})
export class ScheduleModule { }
