import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Page} from '../common/page';
import {Schedule} from '../entity/schedule';
import {Dispatch} from '../entity/dispatch';
import {Term} from '../entity/term';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  baseUrl = 'schedule';

  constructor(private httpClient: HttpClient) { }


  getSchedulesInCurrentTerm(): Observable<Schedule[]> {
    return this.httpClient.get<Schedule[]>(this.baseUrl + '/getSchedulesInCurrentTerm')
      .pipe(map((schedules: Schedule[]) => {
        return schedules.map((schedule: Schedule) => new Schedule(schedule));
      }));
  }



  /**
   * 分页
   * @param param 查询参数
   */
  page(param: {
    size: number,
    page: number,
    courseName?: string,
    termName?: string,
    clazzName?: string,
    teacherName?: string, }):
    Observable<Page<Schedule>> {
    let httpParams = new HttpParams()
      .append('page', param.page.toString())
      .append('size', param.size.toString());
    if (param.courseName) {
      httpParams = httpParams.append('courseName', param.courseName);
    }
    if (param.termName) {
      httpParams = httpParams.append('termName', param.termName);
    }
    if (param.clazzName) {
      httpParams = httpParams.append('clazzName', param.clazzName);
    }
    if (param.teacherName) {
      httpParams = httpParams.append('teacherName', param.teacherName);
    }
    return this.httpClient.get<Page<Schedule>>(`${this.baseUrl}/page`, {params: httpParams})
      .pipe(map(data => new Page<Schedule>(data).toObject(d => new Schedule(d))));
  }

  add(schedule: Schedule): Observable<Schedule> {
    console.log('add', schedule);
    return this.httpClient.post<Schedule>(this.baseUrl, schedule);
  }

  getById(scheduleId: number): Observable<Schedule> {
    return this.httpClient.get<Schedule>(this.baseUrl + '/' + scheduleId);
  }

  edit(scheduleId: number, dispatches: Dispatch[]): Observable<Schedule> {
    return this.httpClient.post<Schedule>(this.baseUrl + '/' + scheduleId, dispatches);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.baseUrl + '/' + id);
  }

  // tslint:disable-next-line:max-line-length
  updateClazzesAndTeachers(scheduleId: number | undefined, teacher1Id: number, teacher2Id: number, clazzIds: number[]): Observable<boolean> {
    const data = {scheduleId, teacher1Id, teacher2Id, clazzIds};
    return this.httpClient.post<boolean>(`${this.baseUrl}/updateClazzesAndTeachers/`, data);
  }

  getSchedulesByTerm(term: Term): Observable<Schedule[]> {
    return this.httpClient.get<Schedule[]>(this.baseUrl + '/getSchedulesByTerm/' + term.id)
      .pipe(map((schedules: Schedule[]) => {
        return schedules.map((schedule: Schedule) => new Schedule(schedule));
      }));
  }
}
