import { NgModule } from '@angular/core';
import {ApiPrefixAndMergeMapInterceptor} from '../app/interceptor/api-prefix-and-merge-map.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {XAuthTokenInterceptor} from '../app/interceptor/x-auth-token.interceptor';



@NgModule({
  providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: ApiPrefixAndMergeMapInterceptor,
        multi: true
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: XAuthTokenInterceptor,
        multi: true
      }
    ]
})
export class ApiProModule { }
