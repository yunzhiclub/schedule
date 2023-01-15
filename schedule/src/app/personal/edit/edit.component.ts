import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../service/user.service';
import {Assert} from '@yunzhi/ng-mock-api';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {HeaderComponent} from '../../part/header/header.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  userId: number | undefined;
  formGroup: FormGroup;

  constructor( private userService: UserService,
               private router: Router,
               private commonService: CommonService,
               private route: ActivatedRoute) {
    this.formGroup = new FormGroup({
      name: new FormControl(''),
      phone: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.userService.getCurrentLoginUser()
      .subscribe(currentLoginUser => {
        this.userId = currentLoginUser.id;
        this.formGroup.get('name')?.setValue(currentLoginUser.name);
        this.formGroup.get('phone')?.setValue(currentLoginUser.phone);
      });
  }

  onSubmit(): void {
    console.log('onsubmit is called', this.formGroup.value);
    Assert.isNumber(this.userId, 'id类型不是number');
    this.userService.update(this.userId as number, {
      name: this.formGroup.get('name')?.value,
      phone: this.formGroup.get('phone')?.value,
    })
      .subscribe(success => {
        console.log('用户更新成功', success);
        this.commonService.success(() => this.router.navigate(['../'], {relativeTo: this.route}));
      }, error => {
        console.log('用户更新失败', error);
        this.commonService.error();
      });
  }

}
