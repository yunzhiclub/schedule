import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PipeModule} from '../pipe/pipe.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    PipeModule,
    RouterTestingModule,
    HttpClientModule
  ],
   exports: [
     PipeModule,
     RouterTestingModule,
     HttpClientModule
   ]
})
export class TestModule { }
