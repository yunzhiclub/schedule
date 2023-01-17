import {Component, EventEmitter, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpEvent, HttpResponse} from '@angular/common/http';
import {TeacherService} from '../../../service/teacher.service';
import {MIMETypes} from '../../../common/MIME-types';
import {tap} from 'rxjs/operators';
import {CommonService} from '../../../service/common.service';
import {StudentService} from '../../../service/student.service';

@Component({
  selector: 'app-student-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent {
  excelMIME = MIMETypes.xlsx;
  @Output()
  beCancel = new EventEmitter<void>();

  @Output()
  beImported = new EventEmitter<void>();

  uploadFun: (file: File) => Observable<HttpEvent<object>>;

  constructor(private studentService: StudentService, private commonService: CommonService) {
    this.uploadFun = (file: File) => {
      return this.studentService.import(file).pipe(tap(data => {
        if (data instanceof HttpResponse) {
          this.commonService.saveFile(data.body as Blob, file.name.substr(0, file.name.lastIndexOf('.')) + '_导入结果');
        }
      }));
    };
  }

  onCancel(): void {
    this.beCancel.emit();
  }

  onUpload($event: HttpResponse<object | null>[]): void {
    this.beImported.emit();
  }
}
