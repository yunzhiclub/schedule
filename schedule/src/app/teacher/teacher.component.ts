import { Component, OnInit } from '@angular/core';
import {Page} from '../../common/page';
import {ActivatedRoute, Params} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {TermService} from '../../service/term.service';
import {Assert, stringToIntegerNumber} from '../../common/utils';
import {config} from '../../conf/app.config';
import {Teacher} from '../../entity/teacher';
import {TeacherService} from '../../service/teacher.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  pageData = new Page<Teacher>();
  params: Params = [];
  showImportComponent = false;
  queryForm = new FormGroup({});
  keys = {
    page: 'page',
    size: 'size',
    searchName: 'searchName',
    searchPhone: 'searchPhone'
  };
  termId: number | undefined;
  constructor(private route: ActivatedRoute,
              private commonService: CommonService,
              private teacherService: TeacherService,
              private termService: TermService
  ) {
  }

  ngOnInit(): void {
    this.queryForm.addControl(this.keys.searchName, new FormControl());
    this.queryForm.addControl(this.keys.searchPhone, new FormControl());
    // 订阅参数变化
    this.route.params.subscribe(params => {
      this.params = params;
      this.queryForm.get(this.keys.searchName)!.setValue(params[this.keys.searchName]);
      this.queryForm.get(this.keys.searchPhone)!.setValue(params[this.keys.searchPhone]);
      this.teacherService.page({
        page: stringToIntegerNumber(params[this.keys.page], 0) as number,
        size: stringToIntegerNumber(params[this.keys.size], config.size) as number,
        searchName: params[this.keys.searchName],
        searchPhone: params[this.keys.searchPhone]})
        .subscribe(data => {
          console.log('ngOnInit', data);
          this.setData(data);
        });
    });
    this.termService.getCurrentTerm()
      .subscribe(term => {
        this.termId = term.id;
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
  private setData(data: Page<Teacher>): void {
    this.validateData(data);
    this.pageData = data;
  }

  /**
   * 校验数据是否满足前台列表的条件
   * @param data 分页数据
   */
  validateData(data: Page<Teacher>): void {
    Assert.isNotNullOrUndefined(data.number, data.size, data.totalElements, '未满足page组件的初始化条件');
    data.content.forEach(v => this.validateTeacher(v));
    this.pageData = data;
  }

  /**
   * 校验字段是否符合V层表现
   * @param teacher 班级
   */
  validateTeacher(teacher: Teacher): void {
    // 必有条件
    Assert.isNotNullOrUndefined(
      teacher.id,
      teacher.name,
      teacher.sex,
      teacher.phone,
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
   * 删除教师
   */
  onDelete(id: any): void {
    Assert.isNotNullOrUndefined(id, 'id未定义');
    this.commonService.confirm(confirm => {
        if (confirm) {
          this.teacherService.delete(id)
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

  /**
   * 查询按钮被按下
   */
  onSubmit(queryForm: FormGroup): void {
    this.reload({...this.params, ...queryForm.value});
  }


  /**
   * 导入按钮被按下.
   */
  onImportButtonClick(): void {
    this.commonService.confirm(confirm => {
      if (confirm) {
        this.showImportComponent = true;
      } else {
        this.teacherService.downloadImportTemplate('教师导入模板' + new Date().toLocaleDateString());
      }
    }, '系统仅支持固定模板的excel文档', '请选择', '我已下载', '下载模板');
  }

  /**
   * 取消导入
   */
  onImportCancel(): void {
    this.showImportComponent = false;
  }

  /**
   * 导入完成
   */
  onImported(): void {
    this.showImportComponent = false;
    this.commonService.success(() => {
      setTimeout(() => this.commonService.reloadByParam(this.params, {forceReload: true}).then(),
        3000);
    }, '', '上传成功');
  }

}
