import { Component, OnInit } from '@angular/core';
import {Page} from '../../common/page';
import {ActivatedRoute, Params} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {Schedule} from '../../entity/schedule';
import {CommonService} from '../../service/common.service';
import {Assert, stringToIntegerNumber} from '../../common/utils';
import {config} from '../../conf/app.config';
import {ScheduleService} from '../../service/schedule.service';
import {Clazz} from '../../entity/clazz';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  pageData = new Page<Schedule>();
  params: Params = [];
  queryForm = new FormGroup({});
  keys = {
    page: 'page',
    size: 'size',
    courseName: 'courseName',
    termName: 'termName',
    clazzName: 'clazzName',
    teacherName: 'teacherName'
  };

  constructor(private commonService: CommonService,
              private route: ActivatedRoute,
              private scheduleService: ScheduleService) { }

  ngOnInit(): void {
    this.queryForm.addControl(this.keys.courseName, new FormControl());
    this.queryForm.addControl(this.keys.termName, new FormControl());
    this.queryForm.addControl(this.keys.clazzName, new FormControl());
    this.queryForm.addControl(this.keys.teacherName, new FormControl());
    // 订阅参数变化
    this.route.params.subscribe(params => {
      this.params = params;
      this.scheduleService.page({
        page: stringToIntegerNumber(params[this.keys.page], 0) as number,
        size: stringToIntegerNumber(params[this.keys.size], config.size) as number,
        courseName: params[this.keys.courseName],
        termName: params[this.keys.termName],
        clazzName: params[this.keys.clazzName],
        teacherName: params[this.keys.teacherName],
      }).subscribe(data => {
          this.setData(data);
          console.log(data);
        });
    });
  }

  /**
   * 设置数据
   * @param data 分页数据
   */
  private setData(data: Page<Schedule>): void {
    this.validateData(data);
    this.pageData = data;
  }

  /**
   * 校验数据是否满足前台列表的条件
   * @param data 分页数据
   */
  validateData(data: Page<Schedule>): void {
    Assert.isNotNullOrUndefined(data.number, data.size, data.totalElements, '未满足page组件的初始化条件');
    data.content.forEach(v => this.validateSchedule(v));
    this.pageData = data;
  }

  /**
   * 校验字段是否符合V层表现
   * @param schedule 排课
   */
  validateSchedule(schedule: Schedule): void {
    // 必有条件
    Assert.isNotNullOrUndefined(
      schedule.id,
      schedule.course,
      schedule.term,
      schedule.teacher1,
      schedule.teacher2,
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

  getClazzNames(clazzes: Clazz[]): string {
    const arr = clazzes.map((clazz) => {
      return clazz.name;
    });
    return arr.join('、');
  }

  onSubmit(queryForm: FormGroup): void {
    this.reload({...this.params, ...queryForm.value});
  }

  onDelete(id: number): void {
    Assert.isNotNullOrUndefined(id, 'id未定义');
    this.commonService.confirm(confirm => {
        if (confirm) {
          this.scheduleService.delete(id)
            .subscribe(success => {
              this.commonService.success(() => {
                this.pageData.content.splice(this.pageData.content.map(schedule => schedule.id).indexOf(id), 1);
              });
            }, error => {
              console.log('删除失败', error);
              this.commonService.error();
            });
        }
      },
    );
  }
}
