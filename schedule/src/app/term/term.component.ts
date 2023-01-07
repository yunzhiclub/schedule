import { Component, OnInit } from '@angular/core';
import {Term} from '../../entity/term';
import {Page} from '../../common/page';
import {ActivatedRoute, Params} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {TermService} from '../../service/term.service';
import {stringToIntegerNumber} from '../../common/utils';
import {config} from '../../conf/app.config';


@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.scss']
})
export class TermComponent implements OnInit {
  pageData = new Page<Term>();
  params: Params = [];
  queryForm = new FormGroup({});
  keys = {
    page: 'page',
    size: 'size',
    name: 'name'
  };
  constructor(private route: ActivatedRoute,
              private commonService: CommonService,
              private termService: TermService
  ) {
  }

  ngOnInit(): void {
    console.log('123123');
    this.queryForm.addControl(this.keys.name, new FormControl());
    // 订阅参数变化
    this.route.params.subscribe(params => {
      this.params = params;
      this.queryForm.get(this.keys.name)!.setValue(params[this.keys.name]);

      this.termService.page({
        page: stringToIntegerNumber(params[this.keys.page], 0) as number,
        size: stringToIntegerNumber(params[this.keys.size], config.size) as number,
        name: params[this.keys.name]})
      .subscribe(data => {
        console.log(data);
      });
    });
  }

  /**
   * 点击分页
   * @param page 当前页
   */
  onPageChange(page: number): void {
    this.reload({...this.params, ...{page}});
  }

  /**
   * 查询
   * @param params page: 当前页 size: 每页大小
   */
  reload(params = this.params): void {
    this.commonService.reloadByParam(params).then();
  }

}
