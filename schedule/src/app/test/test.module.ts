import { NgModule } from '@angular/core';
import {PipeModule} from '../pipe/pipe.module';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';



@NgModule({
  declarations: [],
  imports: [
    PipeModule,
    RouterTestingModule,
    HttpClientTestingModule,
    ReactiveFormsModule
  ],
  providers: [
  ],
  exports: [
    PipeModule,
    RouterTestingModule,
    HttpClientTestingModule,
    ReactiveFormsModule
  ]
})
export class TestModule { }
