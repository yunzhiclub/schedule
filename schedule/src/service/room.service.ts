import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Page} from '../common/page';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Room} from '../entity/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  url = 'room';
  constructor(private httpClient: HttpClient) { }

  /**
   * 分页
   * @param param 查询参数
   */
  page(param: {
    page: number,
    size: number,
    searchName?: string
    searchCapacity?: string
  }): Observable<Page<Room>> {
    let httpParams = new HttpParams()
      .append('page', param.page.toString())
      .append('size', param.size.toString());
    if (param.searchName) {
      httpParams = httpParams.append('name', param.searchName);
    }
    if (param.searchCapacity) {
      httpParams = httpParams.append('capacity', param.searchCapacity);
    }


    return this.httpClient.get<Page<Room>>(`${this.url}/page`, {params: httpParams})
      .pipe(map(data => new Page<Room>(data).toObject(d => new Room(d))));
  }

  /**
   * 新增
   * @param data 新增教室数据
   */
  add(data: { capacity: any; name: any }): Observable<any>  {
    return this.httpClient.post<any>(`${this.url}/add`, data);
  }

  /**
   * 通过id获取教师
   * @param id 教师id
   */
  getById(id: number): Observable<Room>  {
    return this.httpClient.get<Room>(`${this.url}/getById/` + id.toString());
  }

  /**
   * 更新教室
   * @param id 教室id
   * @param data 更新后的教室数据
   */
  update(id: number, data: {capacity: any; name: any}): Observable<any> {
    console.log('update', data);
    return this.httpClient.post<any>(`${this.url}/update/` + id.toString(), data);
  }

  /**
   * 删除教室
   * @param id 教室id
   */
  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/` + id.toString());
  }
}
