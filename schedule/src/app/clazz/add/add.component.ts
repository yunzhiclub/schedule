import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../../service/common.service';
import {Router} from '@angular/router';
import {YzAsyncValidators} from '../../validator/yz-async.validators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {YzValidator} from '../../validator/yz-validator';
import {ClazzService} from '../../../service/clazz.service';
import {Clazz} from '../../../entity/clazz';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  constructor(private clazzService: ClazzService,
              private commonService: CommonService,
              private router: Router,
              private yzAsyncValidators: YzAsyncValidators) { }

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, YzValidator.notEmpty], this.yzAsyncValidators.clazzNameUnique()),
    entranceDate: new FormControl('', [Validators.required, YzValidator.notEmpty]),
    studentNumber: new FormControl('', [Validators.required]),
  });
  keys = {
    name: 'name',
    entranceDate: 'entranceDate',
    studentNumber: 'studentNumber'
  };

  ngOnInit(): void {
  }


  onSubmit(formGroup: FormGroup): void {
    const clazz = new Clazz({
      name: formGroup.get('name')?.value,
      entranceDate: formGroup.get('entranceDate')?.value,
      studentNumber: formGroup.get('studentNumber')?.value,
    });
    this.clazzService.save(clazz)
      .subscribe(() => {
        this.commonService.success(() => {
          this.router.navigateByUrl('/clazz');
        });
      });
  }

}
