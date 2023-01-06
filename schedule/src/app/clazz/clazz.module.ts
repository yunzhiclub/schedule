import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClazzComponent } from './clazz.component';
import {ClazzRoutingModule} from './clazz-routing.module';



@NgModule({
  declarations: [ClazzComponent],
  imports: [
    CommonModule,
    ClazzRoutingModule
  ]
})
export class ClazzModule { }
