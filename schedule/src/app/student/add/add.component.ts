import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../../service/common.service';
import {Router} from '@angular/router';
import {YzAsyncValidators} from '../../validator/yz-async.validators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {YzValidator} from '../../validator/yz-validator';
import {Student} from '../../../entity/student';
import {StudentService} from '../../../service/student.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  constructor(private studentService: StudentService,
              private commonService: CommonService,
              private router: Router,
              private yzAsyncValidators: YzAsyncValidators) { }

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, YzValidator.notEmpty], this.yzAsyncValidators.studentNameUnique()),
    sno: new FormControl('', [Validators.required, YzValidator.notEmpty], this.yzAsyncValidators.snoUnique()),
    clazzId: new FormControl('', [Validators.required, YzValidator.notEmpty]),
    sex: new FormControl(true, [Validators.required]),
  });

  keys = {
    name: 'name',
    sex: 'sex',
    sno: 'sno',
    clazzId: 'clazzId',
  };

  ngOnInit(): void {
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
    this.studentService.save(student)
      .subscribe(() => {
        this.commonService.success(() => {
          this.router.navigateByUrl('/student');
        });
      });
  }

}
