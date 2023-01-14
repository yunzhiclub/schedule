import { Component, OnInit } from '@angular/core';
import {ClazzService} from '../../../service/clazz.service';
import {CommonService} from '../../../service/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {YzAsyncValidators} from '../../validator/yz-async.validators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {YzValidator} from '../../validator/yz-validator';
import {Clazz} from '../../../entity/clazz';
import {Assert} from '../../../common/utils';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  id = 0;

  constructor(private clazzService: ClazzService,
              private commonService: CommonService,
              private router: Router,
              private route: ActivatedRoute,
              private yzAsyncValidators: YzAsyncValidators) {
  }

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, YzValidator.notEmpty], this.yzAsyncValidators.clazzNameUnique()),
    entranceDate: new FormControl('', [Validators.required, YzValidator.notEmpty]),
  });

  keys = {
    name: 'name',
    entranceDate: 'entranceDate',
  };
  clazz = {} as Clazz;

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.id = +param.clazzId;
      const clazzId = +param.clazzId;
      Assert.isNotNullOrUndefined(clazzId, 'ID类型不正确');
      this.formGroup.get(this.keys.name)!.setAsyncValidators(this.yzAsyncValidators.clazzNameUnique(clazzId));
      this.loadById(clazzId);
    });
  }


  onSubmit(formGroup: FormGroup): void {
    const clazz = new Clazz({
      name: formGroup.get('name')?.value,
      entranceDate: formGroup.get('entranceDate')?.value
    });
    this.clazzService.update(this.id, clazz)
      .subscribe(() => {
        this.commonService.success(() => {
          this.router.navigateByUrl('/clazz');
        });
      });
  }

  private loadById(id: number): void {
    this.clazzService.getById(id)
      .subscribe((clazz: Clazz) => {
        this.setClazz(clazz);
        console.log(clazz);
      }, error => {
        throw new Error(error);
      });
  }

  private setClazz(clazz: Clazz): void {
    Assert.isNotNullOrUndefined(clazz,
      clazz.name,
      clazz.entranceDate,
      '用户编辑条件校验失败');
    this.clazz = clazz;
    this.formGroup.get(this.keys.name)!.setValue(clazz.getName());
    this.formGroup.get(this.keys.entranceDate)!.setValue(clazz.getEntranceDate());
  }
}
