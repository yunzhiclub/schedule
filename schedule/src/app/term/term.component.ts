import { Component, OnInit } from '@angular/core';
import {Term} from '../../entity/term';
import {Page} from '../../common/page';
import {ActivatedRoute, Params} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {TermService} from '../../service/term.service';
import {Assert, stringToIntegerNumber, Utils} from '../../common/utils';
import {config} from '../../conf/app.config';
import {TermState} from '../../entity/enum/termState';


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
        this.setData(data);
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

  /**
   * 设置数据
   * @param data 分页数据
   */
  private setData(data: Page<Term>): void {
    this.validateData(data);
    this.pageData = data;
  }

  /**
   * 校验数据是否满足前台列表的条件
   * @param data 分页数据
   */
  validateData(data: Page<Term>): void {
    Assert.isNotNullOrUndefined(data.number, data.size, data.totalElements, '未满足page组件的初始化条件');
    data.content.forEach(v => this.validateTerm(v));
    this.pageData = data;
  }

  /**
   * 校验字段是否符合V层表现
   * @param clazz 班级
   */
  validateTerm(term: Term): void {
    // 必有条件
    Assert.isNotNullOrUndefined(
      term.id,
      term.name,
      term.state,
      term.startTime,
      term.endTime,
      '未满足table列表的初始化条件'
    );
  }

  /**
   * 点击改变每页大小
   * @param size 每页大小
   */
  onSizeChange(size: number): void {
    this.reload({...this.params, ...{size}});
  }

  onSubmit(queryForm: FormGroup): void {
    this.reload({...this.params, ...queryForm.value});
  }

  /**
   * 删除
   * @param term 学期
   */
  onDelete(term: Term): void {
    Assert.isNotNullOrUndefined(term.id, 'id未定义');
    this.commonService.confirm((confirm = false) => {
      if (confirm) {
        const index = this.pageData.content.indexOf(term);
        this.termService.delete(term.id as number)
          .subscribe(() => {
            this.commonService.success(() => this.pageData.content.splice(index, 1));
          });
      }
    }, '');
  }

  active(term: Term): void {
    this.termService.active(term.id as number)
      .subscribe((data: {state: TermState}) => {
        if (data.state) {
          this.deactivate();
          term.state = data.state;
        }
        this.commonService.success();
      });
  }

  private deactivate(): void {
    this.pageData.content.forEach(term => {
      term.state = Term.NOT_ACTIVATE;
    });
  }
}
