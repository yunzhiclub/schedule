import { Component, OnInit } from '@angular/core';
import {Page} from '../../common/page';
import {ActivatedRoute, Params} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {Assert, stringToIntegerNumber} from '../../common/utils';
import {config} from '../../conf/app.config';
import {Clazz} from '../../entity/clazz';
import {ClazzService} from '../../service/clazz.service';

@Component({
  selector: 'app-clazz',
  templateUrl: './clazz.component.html',
  styleUrls: ['./clazz.component.scss']
})
export class ClazzComponent implements OnInit {
  pageData = new Page<Clazz>();
  params: Params = [];
  queryForm = new FormGroup({});
  keys = {
    page: 'page',
    size: 'size',
    name: 'name'
  };
  constructor(private route: ActivatedRoute,
              private commonService: CommonService,
              private clazzService: ClazzService
  ) {
  }

  ngOnInit(): void {
    this.queryForm.addControl(this.keys.name, new FormControl());
    // 订阅参数变化
    this.route.params.subscribe(params => {
      this.params = params;
      this.queryForm.get(this.keys.name)!.setValue(params[this.keys.name]);
      this.clazzService.page({
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
  private setData(data: Page<Clazz>): void {
    this.validateData(data);
    this.pageData = data;
  }

  /**
   * 校验数据是否满足前台列表的条件
   * @param data 分页数据
   */
  validateData(data: Page<Clazz>): void {
    Assert.isNotNullOrUndefined(data.number, data.size, data.totalElements, '未满足page组件的初始化条件');
    data.content.forEach(v => this.validateTerm(v));
    this.pageData = data;
  }

  /**
   * 校验字段是否符合V层表现
   * @param clazz 班级
   */
  validateTerm(clazz: Clazz): void {
    // 必有条件
    Assert.isNotNullOrUndefined(
      clazz.id,
      clazz.name,
      clazz.entranceDate,
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
   * @param clazz 班级
   */
  onDelete(clazz: Clazz): void {
    Assert.isNotNullOrUndefined(clazz.id, 'id未定义');
    this.commonService.confirm((confirm = false) => {
      if (confirm) {
        const index = this.pageData.content.indexOf(clazz);
        this.clazzService.delete(clazz.id as number)
          .subscribe(() => {
            this.commonService.success();
            this.ngOnInit();
          });
      }
    }, '');
  }

}
