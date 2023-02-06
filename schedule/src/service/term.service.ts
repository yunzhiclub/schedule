import { Injectable } from '@angular/core';
import {Term} from '../entity/term';
import {Page} from '../common/page';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {TermState} from '../entity/enum/termState';
import {Assert} from '../common/utils';

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

  /**
   * 新建学期
   * @param term 将要保存的学期对象
   */
  save(term: Term): Observable<Term> {
    return this.httpClient.post<Term>(`${this.url}`, term)
      .pipe(map(data => new Term(data)));
  }

  /**
   * 更新学期
   * @param id 学期id
   * @param term 更新后的学期数据
   */
  update(id: number, term: Term): Observable<any> {
    return this.httpClient.post<any>(`${this.url}/update/` + id.toString(), term);
  }
  /**
   * 学期名是否存在
   * @param name 学期名称
   * @param termId 排除此学期
   */
  public termNameUnique(name: string, termId = 0): Observable<boolean> {
    console.log(termId);
    const httpParams = new HttpParams()
      .append('name', name)
      .append('termId', termId.toString());
    return this.httpClient.get<boolean>(this.url + '/termNameUnique', {params: httpParams});
  }

  /**
   * 删除
   * @param termId id
   */
  delete(termId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${termId}`);
  }

  /**
   * 激活学期
   * @param termId 学期ID
   */
  active(termId: number): Observable<{state: TermState}> {
    return this.httpClient.get<{state: TermState}>(`${this.url}/active/${termId}`);
  }

  /**
   * 根据ID获取实体.
   * @param termId termId
   */
  getById(termId: number): Observable<Term> {
    Assert.isNumber(termId, 'termId类型必须为number');
    return this.httpClient.get<Term>(`${this.url}/${termId}`).pipe(map(data => new Term(data)));
  }

  getCurrentTerm(): Observable<Term> {
    return this.httpClient.get<Term>(`${this.url}/getCurrentTerm`);
  }

  getAll(): Observable<Term[]> {
    return this.httpClient.get<Term[]>(this.url + '/getAll');
  }
}
