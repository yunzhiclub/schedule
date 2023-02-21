import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Page} from '../common/page';
import {map} from 'rxjs/operators';
import {Teacher} from '../entity/teacher';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  url = 'teacher';
  constructor(private httpClient: HttpClient,
              private commonService: CommonService) { }


  /**
   * 分页
   * @param param 查询参数
   */
  page(param: {
    page: number,
    size: number,
    searchName?: string
    searchPhone?: string
  }): Observable<Page<Teacher>> {
    let httpParams = new HttpParams()
      .append('page', param.page.toString())
      .append('size', param.size.toString());
    if (param.searchName) {
      httpParams = httpParams.append('name', param.searchName);
    }
    if (param.searchPhone) {
      httpParams = httpParams.append('phone', param.searchPhone);
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
    return this.httpClient.post<any>(`${this.url}/update/` + id.toString(), data);
  }

  /**
   * 删除教师
   * @param id 教师id
   */
  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/` + id.toString());
  }

  /**
   * 获取所有教师
   */
  getAll(): Observable<Teacher[]> {
    return this.httpClient.get<Teacher[]>(`${this.url}/getAll`);
  }

  /**
   * 教师手机号唯一性验证
   */
  phoneUnique(phone: string, teacherId = 0): Observable<boolean> {
    const httpParams = new HttpParams()
      .append('phone', phone)
      .append('teacherId', teacherId.toString());
    return this.httpClient.get<boolean>(this.url + '/phoneUnique', {params: httpParams});
  }


  /**
   * 导入教师.
   * @param file 文件
   */
  import(file: File): Observable<HttpEvent<object>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.post(`${this.url}/importExcel`,
      formData, {reportProgress: true, observe: 'events', responseType: 'blob'});
  }

  /**
   * 下载导入模板.
   * @param filename 文件名
   */
  downloadImportTemplate(filename: string): void {
    this.httpClient.get(`${this.url}/downloadImportTemplate`, {responseType: 'blob'})
      .subscribe(blob => this.commonService.saveFile(blob, filename + '.xlsx'),
        error => {
          throw new Error(error);
        },
        () => console.log('complate'));
  }
}
