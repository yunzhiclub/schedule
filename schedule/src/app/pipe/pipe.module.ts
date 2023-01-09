import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TermStatePipe} from './term-state.pipe';
import {SexPipe} from './sex.pipe';



@NgModule({
  declarations: [TermStatePipe, SexPipe],
  exports: [
    TermStatePipe,
    SexPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipeModule { }
