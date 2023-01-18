import { Component, OnInit } from '@angular/core';
import {TeacherService} from '../../../service/teacher.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {HttpClient} from '@angular/common/http';
import {YzValidator} from '../../validator/yz-validator';
import {YzAsyncValidators} from '../../validator/yz-async.validators';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  formGroup: FormGroup;
  constructor(private teacherService: TeacherService,
              private router: Router,
              private route: ActivatedRoute,
              private commonService: CommonService,
              private yzAsyncValidators: YzAsyncValidators) {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required, YzValidator.notEmpty]),
      sex: new FormControl(true, [Validators.required]),
      phone: new FormControl('', [Validators.required, YzValidator.phone], this.yzAsyncValidators.phoneUnique())
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log('onsubmit is called', this.formGroup.value);
    this.teacherService.add({
      name: this.formGroup.get('name')?.value,
      sex: this.formGroup.get('sex')?.value,
      phone: this.formGroup.get('phone')?.value,
    })
      .subscribe(success => {
        console.log('教师添加成功', success);
        this.commonService.success(() => this.router.navigate(['../'], {relativeTo: this.route}));
      }, error => {
        console.log('教师添加失败', error);
        this.commonService.error();
      });
  }


}
