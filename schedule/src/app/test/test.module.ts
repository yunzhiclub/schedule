import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PipeModule} from '../pipe/pipe.module';



@NgModule({
  declarations: [],
  imports: [
    PipeModule
  ],
   exports: [
     PipeModule
   ]
})
export class TestModule { }
