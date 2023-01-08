import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DateComponent} from './date.component';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [DateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    DatePipe
  ],
  exports: [DateComponent]
})
export class DateModule { }
