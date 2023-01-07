import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TermStatePipe} from './term-state.pipe';



@NgModule({
  declarations: [TermStatePipe],
  exports: [
    TermStatePipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipeModule { }
