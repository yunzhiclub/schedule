import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {HttpClient} from '@angular/common/http';
import {RoomService} from '../../../service/room.service';
import {Assert} from '@yunzhi/ng-mock-api';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  formGroup: FormGroup | undefined;
  id: number | undefined;
  constructor(private roomService: RoomService,
              private router: Router,
              private route: ActivatedRoute,
              private commonService: CommonService,
              private httpClient: HttpClient) {
    this.id = +this.route.snapshot.params.id;
    this.formGroup = new FormGroup({
      name: new FormControl(''),
      capacity: new FormControl(''),
    });
  }

  ngOnInit(): void {
    Assert.isNumber(this.id, 'id类型错误');
    this.roomService.getById(this.id as number)
      .subscribe(room => {
        console.log('api教室获取成功', room);
        this.formGroup?.get('name')?.setValue(room.name);
        this.formGroup?.get('capacity')?.setValue(room.capacity);
      }, error => {
        console.log('api教室获取失败', error);
      });
  }

  onSubmit(): void  {
    console.log('onsubmit is called', this.formGroup?.value);
    Assert.isNumber(this.id, 'id类型不是number');
    this.roomService.update(this.id as number, {
      name: this.formGroup?.get('name')?.value,
      capacity: this.formGroup?.get('capacity')?.value,
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
