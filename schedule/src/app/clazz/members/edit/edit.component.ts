import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StudentService} from '../../../../service/student.service';
import {Student} from '../../../../entity/student';
import {YzValidator} from '../../../validator/yz-validator';
import {YzAsyncValidators} from '../../../validator/yz-async.validators';
import {CommonService} from '../../../../service/common.service';
import {Assert} from '../../../../common/utils';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  private id = 0;

  constructor(private studentService: StudentService,
              private commonService: CommonService,
              private router: Router,
              private yzAsyncValidators: YzAsyncValidators,
              private route: ActivatedRoute) { }

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, YzValidator.notEmpty]),
    sno: new FormControl('', [Validators.required, YzValidator.notEmpty]),
    clazzId: new FormControl('', [Validators.required]),
    sex: new FormControl(true, [Validators.required]),
  });
  student = {} as Student;
  keys = {
    name: 'name',
    sex: 'sex',
    sno: 'sno',
    clazzId: 'clazzId',
  };

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.id = +param.studentId;
      const studentId = +param.studentId;
      Assert.isNotNullOrUndefined(studentId, 'ID类型不正确');
      this.formGroup.get(this.keys.name)!.setAsyncValidators(this.yzAsyncValidators.studentNameUnique(studentId));
      this.formGroup.get(this.keys.sno)!.setAsyncValidators(this.yzAsyncValidators.snoUnique(studentId));
      this.loadById(studentId);
    });
  }

  onSubmit(formGroup: FormGroup): void {
    const student = new Student({
      name: formGroup.get(this.keys.name)?.value,
      sex: formGroup.get(this.keys.sex)?.value,
      sno: formGroup.get(this.keys.sno)?.value,
      clazz: {
        id: formGroup.get(this.keys.clazzId)?.value
      }
    } as Student);
    this.studentService.update(this.id, student)
      .subscribe(() => {
        this.commonService.success(() => this.router.navigate(['../../'], {relativeTo: this.route}));
      });
  }

  private loadById(id: number): void {
    this.studentService.getById(id)
      .subscribe((student: Student) => {
        this.setStudent(student);
      }, error => {
        throw new Error(error);
      });
  }

  private setStudent(student: Student): void {
    Assert.isNotNullOrUndefined(student,
      student.name,
      student.sex,
      student.sno,
      student.clazz, '用户编辑条件校验失败');
    this.student = student;
    this.formGroup.get(this.keys.name)!.setValue(student.getName());
    this.formGroup.get(this.keys.sex)!.setValue(student.getSex());
    this.formGroup.get(this.keys.sno)!.setValue(student.getSno());
    this.formGroup.get(this.keys.clazzId)!.setValue(student.getClazz().getId());
  }
}
