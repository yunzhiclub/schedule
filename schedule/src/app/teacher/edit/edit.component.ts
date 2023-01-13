import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TeacherService} from '../../../service/teacher.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {HttpClient} from '@angular/common/http';
import {Assert} from '@yunzhi/ng-mock-api';
import {YzAsyncValidators} from '../../validator/yz-async.validators';
import {YzValidator} from '../../validator/yz-validator';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  formGroup: FormGroup;
  id: number | undefined;
  constructor(private teacherService: TeacherService,
              private router: Router,
              private route: ActivatedRoute,
              private commonService: CommonService,
              private yzAsyncValidators: YzAsyncValidators,
              private httpClient: HttpClient) {
    // id为teacher所对应的user_id
    this.id = +this.route.snapshot.params.id;
    this.formGroup = new FormGroup({
      name: new FormControl(''),
      sex: new FormControl(0),
      phone: new FormControl('', [Validators.required, YzValidator.notEmpty], this.yzAsyncValidators.phoneUnique(this.id))
    });
  }

  ngOnInit(): void {
    Assert.isNumber(this.id, 'id类型错误');
    this.teacherService.getById(this.id as number)
      .subscribe(teacher => {
        console.log('api教师获取成功', teacher);
        this.formGroup.get('name')?.setValue(teacher.name);
        this.formGroup.get('sex')?.setValue(teacher.sex);
        this.formGroup.get('phone')?.setValue(teacher.phone);
      }, error => {
        console.log('api教师获取失败', error);
      });
  }

  onSubmit(): void {
    console.log('onsubmit is called', this.formGroup.value);
    Assert.isNumber(this.id, 'id类型不是number');
    this.teacherService.update(this.id as number, {
      name: this.formGroup.get('name')?.value,
      sex: this.formGroup.get('sex')?.value,
      phone: this.formGroup.get('phone')?.value,
    })
      .subscribe(success => {
        console.log('教师更新成功', success);
        this.commonService.success(() => this.router.navigate(['./../../'], {relativeTo: this.route}));
      }, error => {
        console.log('教师更新失败', error);
        this.commonService.error();
      });
  }
}
