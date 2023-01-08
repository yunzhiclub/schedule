import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from "rxjs";
import {Page} from "../common/page";
import {Term} from "../entity/term";
import {map} from "rxjs/operators";
import {Teacher} from "../entity/teacher";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  url = 'teacher';
  constructor(private httpClient: HttpClient) { }


  /**
   * 分页
   * @param param 查询参数
   */
  page(param: {
    page: number,
    size: number,
    name?: string
  }): Observable<Page<Teacher>> {
    let httpParams = new HttpParams()
      .append('page', param.page.toString())
      .append('size', param.size.toString());
    if (param.name) {
      httpParams = httpParams.append('name', param.name);
    }

    return this.httpClient.get<Page<Teacher>>(`${this.url}/page`, {params: httpParams})
      .pipe(map(data => new Page<Teacher>(data).toObject(d => new Teacher(d))));
  }

  /**
   * 新增
   * @param data 新增教师数据
   */
  add(data: {name: string, sex: boolean, phone: string}): Observable<any> {
    return this.httpClient.post<any>(`${this.url}/add`, data);
  }

  /**
   * 通过id获取教师
   * @param id 教师id
   */
  getById(id: number): Observable<Teacher> {
    return this.httpClient.get<Teacher>(`${this.url}/getById/` + id.toString());
  }

  /**
   * 更新教师
   * @param id 教师id
   * @param data 更新后的教师数据
   */
  update(id: number, data: {name: string, sex: number, phone: string}): Observable<any> {
    console.log('update', data);
    return this.httpClient.post<any>(`${this.url}/update/` + id.toString(), data);
  }

}
