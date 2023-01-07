import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiPrefixAndMergeMapInterceptor} from '../app/interceptor/api-prefix-and-merge-map.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';



@NgModule({
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiPrefixAndMergeMapInterceptor,
    multi: true
  }]
})
export class ApiProModule { }
