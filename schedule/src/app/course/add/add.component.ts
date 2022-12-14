import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {HttpClient} from '@angular/common/http';
import {CourseService} from '../../../service/course.service';
import {YzValidator} from '../../validator/yz-validator';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private courseService: CourseService,
              private router: Router,
              private route: ActivatedRoute,
              private commonService: CommonService) {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required, YzValidator.notEmpty]),
      hours: new FormControl('', [Validators.required, YzValidator.notEmpty])
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log('onsubmit is called', this.formGroup.value);
    this.courseService.add({
      name: this.formGroup.get('name')?.value,
      hours: this.formGroup.get('hours')?.value,
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
