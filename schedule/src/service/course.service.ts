import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Page} from '../common/page';
import {Room} from '../entity/room';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Course} from '../entity/course';
import {Clazz} from "../entity/clazz";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  url = 'course';

  constructor(private httpClient: HttpClient) { }

  /**
   * 分页
   * @param param 查询参数
   */
  page(param: {
    page: number,
    size: number,
    searchName?: string
    searchHours?: number
  }): Observable<Page<Course>> {
    let httpParams = new HttpParams()
      .append('page', param.page.toString())
      .append('size', param.size.toString());
    if (param.searchName) {
      httpParams = httpParams.append('name', param.searchName);
    }
    if (param.searchHours) {
      httpParams = httpParams.append('hours', String(param.searchHours));
    }


    return this.httpClient.get<Page<Course>>(`${this.url}/page`, {params: httpParams})
      .pipe(map(data => new Page<Course>(data).toObject(d => new Course(d))));
  }

  /**
   * 删除课程
   * @param id 课程id
   */
  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/` + id.toString());
  }

  /**
   * 新增
   * @param data 新增课程数据
   */
  add(data: { hours: any; name: any }): Observable<any>  {
    return this.httpClient.post<any>(`${this.url}/add`, data);
  }

  /**
   * 通过id获取课程
   * @param id 课程id
   */
  getById(id: number): Observable<Course>  {
    return this.httpClient.get<Course>(`${this.url}/getById/` + id.toString());
  }

  /**
   * 更新课程
   * @param id 课程id
   * @param data 更新后的课程数据
   */
  update(id: number, data: {hours: any; name: any}): Observable<any> {
    console.log('update', data);
    return this.httpClient.post<any>(`${this.url}/update/` + id.toString(), data);
  }

  /**
   * 获取所有课程
   */
  getAll(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${this.url}/getAll/`);
  }
}
