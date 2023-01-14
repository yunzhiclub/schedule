import { Component, OnInit } from '@angular/core';
import {TermService} from '../../../service/term.service';
import {CommonService} from '../../../service/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {YzAsyncValidators} from '../../validator/yz-async.validators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {YzValidator} from '../../validator/yz-validator';
import {Term} from '../../../entity/term';
import {Assert} from '../../../common/utils';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  id: number;

  constructor(private termService: TermService,
              private commonService: CommonService,
              private router: Router,
              private route: ActivatedRoute,
              private yzAsyncValidators: YzAsyncValidators) {
    this.id = +this.route.snapshot.params.id;
  }

  term = {} as Term;

  formGroup = new FormGroup({});

  keys = {
    name: 'name',
    state: 'state',
    startTime: 'startTime',
    endTime: 'endTime'
  };
  isTimeRight: boolean | undefined;

  ngOnInit(): void {
    this.formGroup.addControl(this.keys.name,
      new FormControl('', [Validators.required, YzValidator.notEmpty]));
    this.formGroup.addControl(this.keys.state,
      new FormControl(false, [Validators.required]));
    this.formGroup.addControl(this.keys.startTime,
      new FormControl('', [Validators.required, YzValidator.notEmpty]));
    this.formGroup.addControl(this.keys.endTime,
      new FormControl('', [Validators.required, YzValidator.notEmpty]));

    this.route.params.subscribe(param => {
      const id = +param.id;
      Assert.isNotNullOrUndefined(id, 'ID类型不正确');
      this.formGroup.get(this.keys.name)!.setAsyncValidators(this.yzAsyncValidators.termNameUnique(id));
      this.loadById(id);
    });

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
    console.log(this.id);
    this.termService.update(this.id, term)
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

  private loadById(id: number): void {
    this.termService.getById(id)
      .subscribe((term: Term) => {
        this.setTerm(term);
        console.log(term);
      }, error => {
        throw new Error(error);
      });
  }

  private setTerm(term: Term): void {
    Assert.isNotNullOrUndefined(term,
      term.name,
      term.state,
      term.startTime,
      term.endTime, '用户编辑条件校验失败');
    this.term = term;
    this.formGroup.get(this.keys.name)!.setValue(term.getName());
    this.formGroup.get(this.keys.state)!.setValue(term.getState());
    this.formGroup.get(this.keys.startTime)!.setValue(term.getStartTime());
    this.formGroup.get(this.keys.endTime)!.setValue(term.getEndTime());
  }
}
