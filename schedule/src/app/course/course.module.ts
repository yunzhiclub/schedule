import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from './course.component';
import {CourseRoutingModule} from './course-routing.module';
import {SizeModule} from "../../common/size/size.module";
import {PageModule} from "../../common/page/page.module";
import {ReactiveFormsModule} from "@angular/forms";
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';



@NgModule({
  declarations: [CourseComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    CourseRoutingModule,
    SizeModule,
    PageModule,
    ReactiveFormsModule
  ]
})
export class CourseModule { }
