import { Component, OnInit } from '@angular/core';
import {Page} from '../../common/page';
import {Student} from '../../entity/student';
import {ActivatedRoute, Params} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {StudentService} from '../../service/student.service';
import {Assert, stringToIntegerNumber} from '../../common/utils';
import {config} from '../../conf/app.config';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  pageData = new Page<Student>();
  showImportComponent = false;
  params: Params = [];
  queryForm = new FormGroup({});
  keys = {
    page: 'page',
    size: 'size',
    name: 'name',
    sno: 'sno',
    clazzName: 'clazzName'
  };
  clazzId: number | undefined;
  constructor(private route: ActivatedRoute,
              private commonService: CommonService,
              private studentService: StudentService
  ) {
  }

  ngOnInit(): void {
    this.queryForm.addControl(this.keys.name, new FormControl());
    this.queryForm.addControl(this.keys.sno, new FormControl());
    this.queryForm.addControl(this.keys.clazzName, new FormControl());
    // 订阅参数变化
    this.route.params.subscribe(params => {
      this.params = params;
      this.clazzId = params.clazzId;
      console.log(params);
      this.queryForm.get(this.keys.name)!.setValue(params[this.keys.name]);
      this.queryForm.get(this.keys.sno)!.setValue(params[this.keys.sno]);
      this.queryForm.get(this.keys.clazzName)!.setValue(params[this.keys.clazzName]);
      this.studentService.page({
        page: stringToIntegerNumber(params[this.keys.page], 0) as number,
        size: stringToIntegerNumber(params[this.keys.size], config.size) as number,
        clazzId: this.clazzId,
        clazzName: params[this.keys.clazzName],
        name: params[this.keys.name],
        sno: params[this.keys.sno],
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
  private setData(data: Page<Student>): void {
    this.validateData(data);
    this.pageData = data;
  }

  /**
   * 校验数据是否满足前台列表的条件
   * @param data 分页数据
   */
  validateData(data: Page<Student>): void {
    Assert.isNotNullOrUndefined(data.number, data.size, data.totalElements, '未满足page组件的初始化条件');
    data.content.forEach(v => this.validateTerm(v));
    this.pageData = data;
  }

  /**
   * 校验字段是否符合V层表现
   * @param student 学生
   */
  validateTerm(student: Student): void {
    // 必有条件
    Assert.isNotNullOrUndefined(
      student.id,
      student.name,
      student.sex,
      student.sno,
      student.clazz,
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
   * @param student 学生
   */
  onDelete(student: Student): void {
    Assert.isNotNullOrUndefined(student.id, 'id未定义');
    this.commonService.confirm((confirm = false) => {
      if (confirm) {
        const index = this.pageData.content.indexOf(student);
        this.studentService.delete(student.id as number)
          .subscribe(() => {
            this.commonService.success();
            this.ngOnInit();
          });
      }
    }, '');
  }
  /**
   * 导入按钮被按下.
   */
  onImportButtonClick(): void {
    this.commonService.confirm(confirm => {
      if (confirm) {
        this.showImportComponent = true;
      } else {
        this.studentService.downloadImportTemplate('学生导入模板' + new Date().toLocaleDateString());
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
