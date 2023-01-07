import { Injectable } from '@angular/core';
import {Term} from '../entity/term';
import {Page} from '../common/page';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  url = 'term';
  constructor(private httpClient: HttpClient) { }

  /**
   * 分页
   * @param param 查询参数
   */
  page(param: {
    page: number,
    size: number,
    name?: string
  }): Observable<Page<Term>> {
    let httpParams = new HttpParams()
      .append('page', param.page.toString())
      .append('size', param.size.toString());
    if (param.name) {
      httpParams = httpParams.append('name', param.name);
    }

    return this.httpClient.get<Page<Term>>(`${this.url}/page`, {params: httpParams})
      .pipe(map(data => new Page<Term>(data).toObject(d => new Term(d))));
  }
}
