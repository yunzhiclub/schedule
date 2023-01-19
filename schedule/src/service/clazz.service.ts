import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Page} from '../common/page';
import {map} from 'rxjs/operators';
import {Assert} from '../common/utils';
import {Clazz} from '../entity/clazz';

@Injectable({
  providedIn: 'root'
})
export class ClazzService {
  url = 'clazz';
  constructor(private httpClient: HttpClient) { }

  /**
   * 分页
   * @param param 查询参数
   */
  page(param: {
    page: number,
    size: number,
    name?: string
  }): Observable<Page<Clazz>> {
    let httpParams = new HttpParams()
      .append('page', param.page.toString())
      .append('size', param.size.toString());
    if (param.name) {
      httpParams = httpParams.append('name', param.name);
    }

    return this.httpClient.get<Page<Clazz>>(`${this.url}/page`, {params: httpParams})
      .pipe(map(data => new Page<Clazz>(data).toObject(d => new Clazz(d))));
  }

  /**
   * 新建班级
   * @param clazz 将要保存的班级对象
   */
  save(clazz: Clazz): Observable<Clazz> {
    return this.httpClient.post<Clazz>(`${this.url}`, clazz)
      .pipe(map(data => new Clazz(data)));
  }
  /**
   * 班级名是否存在
   * @param name 班级名称
   * @param clazzId 排除此班级
   */
  public clazzNameUnique(name: string, clazzId = 0): Observable<boolean> {
    const httpParams = new HttpParams()
      .append('name', name)
      .append('clazzId', clazzId.toString());
    return this.httpClient.get<boolean>(this.url + '/clazzNameUnique', {params: httpParams});
  }

  /**
   * 删除
   * @param clazzId id
   */
  delete(clazzId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${clazzId}`);
  }

  /**
   * 根据ID获取实体.
   * @param clazzId clazzId
   */
  getById(clazzId: number): Observable<Clazz> {
    Assert.isNumber(clazzId, 'termId类型必须为number');
    return this.httpClient.get<Clazz>(`${this.url}/${clazzId}`).pipe(map(data => new Clazz(data)));
  }

  /**
   * 获取所有班级
   */
  getAll(): Observable<Clazz[]> {
    return this.httpClient.get<Clazz[]>(`${this.url}/getAll`);
  }

  /**
   * 通过课程id获取所有已经被排过该课程的班级
   */
  clazzesHaveSelectCourse(courseId: number): Observable<number[]> {
    return this.httpClient.get<number[]>('/clazz/clazzesHaveSelectCourse/' + courseId.toString());
  }

  /**
   * 更新班级
   * @param id    班级id
   * @param clazz 将要更新的班级对象
   */
  update(id: number, clazz: Clazz): Observable<any> {
    return this.httpClient.post<any>(`${this.url}/update/` + id.toString(), clazz);
  }
  /**
   * 从排课中移除班级
   */
  removeClazzFromSchedule(clazzId: number, scheduleId: number | undefined): Observable<void> {
    const data = [];
    data[0] = scheduleId;
    data[1] = clazzId;
    return this.httpClient.post<void>('/schedule/removeClazzFromSchedule', data);
  }
}
