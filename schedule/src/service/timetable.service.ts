import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  url = 'timetable';

  constructor(private httpClient: HttpClient) { }
  /**
   * 导出excel
   */
  timetableExport(): Observable<Blob> {
    return this.httpClient.get<Blob>(`${this.url}/timetableExport`,
      {responseType: 'blob' as 'json'});
  }
}
