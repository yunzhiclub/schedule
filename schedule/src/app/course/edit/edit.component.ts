import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {HttpClient} from '@angular/common/http';
import {CourseService} from '../../../service/course.service';
import {Assert} from '@yunzhi/ng-mock-api';
import {YzValidator} from '../../validator/yz-validator';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  formGroup: FormGroup;
  id: number | undefined;

  constructor(private courseService: CourseService,
              private router: Router,
              private route: ActivatedRoute,
              private commonService: CommonService,
              private httpClient: HttpClient) {
    this.id = +this.route.snapshot.params.id;
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required, YzValidator.notEmpty]),
      hours: new FormControl('', [Validators.required, YzValidator.notEmpty])
    });
  }

  ngOnInit(): void {
    Assert.isNumber(this.id, 'id类型错误');
    this.courseService.getById(this.id as number)
      .subscribe(course => {
        console.log('api课程获取成功', course);
        this.formGroup?.get('name')?.setValue(course.name);
        this.formGroup?.get('hours')?.setValue(course.hours);
      }, error => {
        console.log('api课程获取失败', error);
      });
  }

  onSubmit(): void  {
    console.log('onsubmit is called', this.formGroup?.value);
    Assert.isNumber(this.id, 'id类型不是number');
    this.courseService.update(this.id as number, {
      name: this.formGroup?.get('name')?.value,
      hours: this.formGroup?.get('hours')?.value,
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
