import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherComponent } from './teacher.component';
import {TeacherRoutingModule} from './teacher-routing.module';
import {SizeModule} from "../../common/size/size.module";
import {PageModule} from "../../common/page/page.module";
import { AddComponent } from './add/add.component';
import {ReactiveFormsModule} from "@angular/forms";
import { EditComponent } from './edit/edit.component';



@NgModule({
  declarations: [TeacherComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    SizeModule,
    PageModule,
    ReactiveFormsModule
  ]
})
export class TeacherModule { }
