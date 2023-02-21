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
import {Term} from '../../entity/term';
import {TermService} from '../../service/term.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  pageData = new Page<Schedule>();
  params: Params = {};
  queryForm = new FormGroup({});
  keys = {
    page: 'page',
    size: 'size',
    courseName: 'courseName',
    termId: 'termId',
    clazzName: 'clazzName',
    teacherName: 'teacherName'
  };
  term = {} as Term;
  terms = [] as Term[];
  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
  ];
  weekNumber: number | undefined;
  overtimeWeekNumber: number | undefined;
  constructor(private commonService: CommonService,
              private route: ActivatedRoute,
              private termService: TermService,
              private scheduleService: ScheduleService) { }

  ngOnInit(): void {
    this.queryForm.addControl(this.keys.courseName, new FormControl());
    this.queryForm.addControl(this.keys.termId, new FormControl());
    this.queryForm.addControl(this.keys.clazzName, new FormControl());
    this.queryForm.addControl(this.keys.teacherName, new FormControl());
    // 订阅参数变化
    this.route.params.subscribe(params => {
      this.params = params;
      this.loadData();
    });
    this.termService.getAll()
      .subscribe(terms => {
        this.terms = terms;
        let x = 0;
        for (const term of terms) {
          if (term.state === true) {
            x++;
          }
        }
        if (x <= 1) {
          this.termService.getCurrentTerm()
            .subscribe((term: Term) => {
              this.term = term;

              let seconds = +term.endTime - +term.startTime;
              let days = Math.ceil(seconds / (60 * 60 * 24));
              this.weekNumber = Math.ceil(days / 7);
              const timestamp = Date.parse(new Date().toString()) / 1000;
              seconds = timestamp - +term.startTime;
              days = Math.floor(seconds / (60 * 60 * 24));
              this.overtimeWeekNumber = Math.floor(days / 7);

              this.queryForm.get(this.keys.termId)?.setValue(term.id);
              this.params = {termId: term.id};
              this.loadData();
            });
        } else {
          this.commonService.info(() => {}, '获取到多个激活学期,请检查学期管理');
        }
      });
  }
  private loadData(): void {
    this.scheduleService.page({
      page: stringToIntegerNumber(this.params[this.keys.page], 0) as number,
      size: stringToIntegerNumber(this.params[this.keys.size], config.size) as number,
      courseName: this.params[this.keys.courseName],
      termId: this.params[this.keys.termId],
      clazzName: this.params[this.keys.clazzName],
      teacherName: this.params[this.keys.teacherName],
    }).subscribe(data => {
      this.setData(data);
      console.log(data);
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
