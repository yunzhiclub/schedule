import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Schedule} from '../entity/schedule';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

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
}
