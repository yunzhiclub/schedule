import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Term} from '../../../entity/term';
import {TermService} from '../../../service/term.service';
import {YzValidator} from '../../validator/yz-validator';
import {CommonService} from '../../../service/common.service';
import {Router} from '@angular/router';
import {YzAsyncValidators} from '../../validator/yz-async.validators';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  constructor(private termService: TermService,
              private commonService: CommonService,
              private router: Router,
              private yzAsyncValidators: YzAsyncValidators) { }

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, YzValidator.notEmpty], this.yzAsyncValidators.termNameUnique()),
    state: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required, YzValidator.notEmpty]),
    endTime: new FormControl('', [Validators.required, YzValidator.notEmpty])
  });
  keys = {
    name: 'name',
    state: 'state',
    startTime: 'startTime',
    endTime: 'endTime'
  };
  isTimeRight: boolean | undefined;

  ngOnInit(): void {
    this.checkTime();
  }


  onSubmit(formGroup: FormGroup): void {
    const term = new Term({
      name: formGroup.get('name')?.value,
      state: formGroup.get('state')?.value,
      startTime: formGroup.get('startTime')?.value,
      endTime: formGroup.get('endTime')?.value,
    });
    console.log(term);
    this.termService.save(term)
      .subscribe(() => {
        this.commonService.success(() => {
          this.router.navigateByUrl('/term');
        });
      });
  }

  private checkTime(): void {
    this.formGroup.get(this.keys.startTime)?.valueChanges
      .subscribe((value) => {
        const endTime = this.formGroup.get(this.keys.endTime)?.value;
        this.isTimeRight = endTime > 0 && value < endTime;
        console.log(this.isTimeRight);
      });
    this.formGroup.get(this.keys.endTime)?.valueChanges
      .subscribe((value) => {
        const startTime = this.formGroup.get(this.keys.startTime)?.value;
        this.isTimeRight = startTime > 0 && value > startTime;
        console.log(this.isTimeRight);
      });
  }
}
