import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherComponent } from './teacher.component';
import {TeacherRoutingModule} from './teacher-routing.module';
import {SizeModule} from '../../common/size/size.module';
import {PageModule} from '../../common/page/page.module';
import { AddComponent } from './add/add.component';
import {ReactiveFormsModule} from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import {PipeModule} from '../pipe/pipe.module';
import {ImportComponent} from './import/import.component';
import {YzUploaderModule} from '../../common/yz-uploader/yz-uploader.module';



@NgModule({
  declarations: [TeacherComponent, AddComponent, EditComponent, ImportComponent],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    SizeModule,
    PageModule,
    ReactiveFormsModule,
    PipeModule,
    YzUploaderModule
  ]
})
export class TeacherModule { }
