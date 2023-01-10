import { Component, OnInit } from '@angular/core';
import {Page} from '../../common/page';
import {Assert, stringToIntegerNumber} from '../../common/utils';
import {ActivatedRoute, Params} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {CourseService} from '../../service/course.service';
import {Course} from '../../entity/course';
import {config} from '../../conf/app.config';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  pageData = new Page<Course>();
  params: Params = [];
  queryForm = new FormGroup({});
  keys = {
    page: 'page',
    size: 'size',
    searchName: 'searchName',
    searchHours: 'searchHours'
  };

  constructor(private route: ActivatedRoute,
              private commonService: CommonService,
              private courseService: CourseService) { }

  ngOnInit(): void {
    this.queryForm.addControl(this.keys.searchName, new FormControl());
    this.queryForm.addControl(this.keys.searchHours, new FormControl());
    // 订阅参数变化
    this.route.params.subscribe(params => {
      this.params = params;
      this.queryForm.get(this.keys.searchName)!.setValue(params[this.keys.searchName]);
      this.queryForm.get(this.keys.searchHours)!.setValue(params[this.keys.searchHours]);
      this.courseService.page({
        page: stringToIntegerNumber(params[this.keys.page], 0) as number,
        size: stringToIntegerNumber(params[this.keys.size], config.size) as number,
        searchName: params[this.keys.searchName],
        searchHours: params[this.keys.searchHours]
      })
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
  private setData(data: Page<Course>): void {
    this.validateData(data);
    this.pageData = data;
  }

  /**
   * 校验数据是否满足前台列表的条件
   * @param data 分页数据
   */
  validateData(data: Page<Course>): void {
    Assert.isNotNullOrUndefined(data.number, data.size, data.totalElements, '未满足page组件的初始化条件');
    data.content.forEach(v => this.validateCourse(v));
    this.pageData = data;
  }

  /**
   * 校验字段是否符合V层表现
   * @param teacher 班级
   */
  validateCourse(room: Course): void {
    // 必有条件
    Assert.isNotNullOrUndefined(
      room.id,
      room.name,
      room.hours,
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
   * 查询按钮被按下
   */
  onSubmit(queryForm: FormGroup): void {
    this.reload({...this.params, ...queryForm.value});
  }

  /**
   * 删除课程
   */
  onDelete(id: any): void  {
    Assert.isNotNullOrUndefined(id, 'id未定义');
    this.commonService.confirm(confirm => {
        if (confirm) {
          this.courseService.delete(id)
            .subscribe(success => {
              console.log('删除成功', success);
              this.commonService.success();
              this.ngOnInit();
            }, error => {
              console.log('删除失败', error);
              this.commonService.success();
            });
        }
      },
    );
  }
}
