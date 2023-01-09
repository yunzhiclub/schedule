import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentComponent } from './student.component';
import {StudentRoutingModule} from './student-routing.module';
import {Routes} from '@angular/router';
import {PageModule} from '../../common/page/page.module';
import {PipeModule} from '../pipe/pipe.module';
import {SizeModule} from '../../common/size/size.module';
import {ReactiveFormsModule} from '@angular/forms';
import {AddComponent} from './add/add.component';
import {ClazzSelectModule} from '../../common/clazz-select/clazz-select.module';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [StudentComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    StudentRoutingModule,
    PageModule,
    PipeModule,
    SizeModule,
    ReactiveFormsModule,
    ClazzSelectModule,
  ]
})
export class StudentModule { }
