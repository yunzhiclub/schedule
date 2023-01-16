import { NgModule } from '@angular/core';
import {ApiPrefixAndMergeMapInterceptor} from '../app/interceptor/api-prefix-and-merge-map.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {XAuthTokenInterceptor} from '../app/interceptor/x-auth-token.interceptor';
import {HttpErrorInterceptor} from '../app/interceptor/http-error.interceptor';



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
      },
    //  暂时不检查 interceptor(前后) loginsession(前)
    //   {
    //     provide: HTTP_INTERCEPTORS,
    //     useClass: HttpErrorInterceptor,
    //     multi: true
    //   }
    ]
})
export class ApiProModule { }
