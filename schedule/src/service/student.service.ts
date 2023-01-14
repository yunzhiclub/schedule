import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Page} from '../common/page';
import {map} from 'rxjs/operators';
import {Assert} from '../common/utils';
import {Student} from '../entity/student';
import {Clazz} from '../entity/clazz';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  url = 'student';
  constructor(private httpClient: HttpClient) { }

  /**
   * 分页
   * @param param 查询参数
   */
  page(param: {
    page: number,
    size: number,
    clazzId?: number,
    name?: string,
    sno?: string,
  }): Observable<Page<Student>> {
    let httpParams = new HttpParams()
      .append('page', param.page.toString())
      .append('size', param.size.toString());
    if (param.clazzId) {
      httpParams = httpParams.append('clazzId', param.clazzId.toString());
    }
    if (param.name) {
      httpParams = httpParams.append('name', param.name);
    }
    if (param.sno) {
      httpParams = httpParams.append('sno', param.sno);
    }

    return this.httpClient.get<Page<Student>>(`${this.url}/page`, {params: httpParams})
      .pipe(map(data => new Page<Student>(data).toObject(d => new Student(d))));
  }

  /**
   * 新建学生
   * @param student 将要保存的学生对象
   */
  save(student: Student): Observable<Student> {
    return this.httpClient.post<Student>(`${this.url}`, student)
      .pipe(map(data => new Student(data)));
  }
  /**
   * 学生名是否存在
   * @param name 学生名称
   * @param studentId 排除此学生
   */
  public studentNameUnique(name: string, studentId = 0): Observable<boolean> {
    const httpParams = new HttpParams()
      .append('name', name)
      .append('studentId', studentId.toString());
    return this.httpClient.get<boolean>(this.url + '/studentNameUnique', {params: httpParams});
  }


  snoUnique(sno: string, studentId = 0): Observable<boolean> {
    const httpParams = new HttpParams()
      .append('sno', sno)
      .append('studentId', studentId.toString());
    return this.httpClient.get<boolean>(this.url + '/snoUnique', {params: httpParams});
  }

  /**
   * 删除
   * @param studentId id
   */
  delete(studentId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${studentId}`);
  }

  /**
   * 根据ID获取实体.
   * @param studentId studentId
   */
  getById(studentId: number): Observable<Student> {
    Assert.isNumber(studentId, 'termId类型必须为number');
    return this.httpClient.get<Student>(`${this.url}/${studentId}`).pipe(map(data => {
      data.clazz = new Clazz(data.clazz!);
      return new Student(data);
    }));
  }

  /**
   * 更新学生
   * @param id      学生id
   * @param student 将要更新的学生对象
   */
  update(id: number, student: Student): Observable<any> {
    return this.httpClient.post<any>(`${this.url}/update/` + id.toString(), student);
  }
}
