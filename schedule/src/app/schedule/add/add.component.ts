import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Course} from '../../../entity/course';
import {Clazz} from '../../../entity/clazz';
import {ClazzService} from '../../../service/clazz.service';
import {CourseService} from '../../../service/course.service';
import {Teacher} from "../../../entity/teacher";
import {TeacherService} from "../../../service/teacher.service";
import {parseJsonSchemaToCommandDescription} from "@angular/cli/utilities/json-schema";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  formGroup = new FormGroup({
    courseId: new FormControl('', Validators.required),
    clazzIds: new FormControl(null, Validators.required),
    teacher1Id: new FormControl(null, Validators.required),
    teacher2Id: new FormControl(null, Validators.required)
  });

  courseTimes = [] as {weeks: number[], roomIds: number[]}[][];
  /* 可选课程 */
  courses =  []  as Course[];
  teachers =  []  as Teacher[];
  /* 待处理班级，需要筛选掉已经上过该门课的班级 */
  clazzesToBeScreened = [] as Clazz[];
  /* 可选班级，clazzes筛选过后的班级 */
  clazzes: Clazz[] = [];
  lessons = [1, 2, 3, 4, 5];
  days = ['一', '二', '三', '四', '五', '六', '日'];
  isShowTeacherSelect = false;
  constructor(private clazzService: ClazzService,
              private courseService: CourseService,
              private teacherService: TeacherService) { }

  ngOnInit(): void {
    this.initCourseTimes();
    this.courseService.getAll()
      .subscribe(allCourse => {
        this.courses = allCourse;
      });
    this.clazzService.getAll()
      .subscribe(allClazz => {
        this.clazzesToBeScreened = allClazz;
      });
    this.teacherService.getAll()
      .subscribe(allTeacher => {
        this.teachers = allTeacher;
      });
  }

  initCourseTimes(): void {
    for (let i = 0; i < 7; i++) {
      this.courseTimes[i] = [];
      for (let j = 0; j < 5; j++) {
        this.courseTimes[i][j] = {} as {weeks: number[], roomIds: number[]};
        this.courseTimes[i][j].weeks = [];
        this.courseTimes[i][j].roomIds = [];
      }
    }
  }
  onClazzIdsChange(): void {
    // 班级有变动，courseTimes要清空， 防止之前的班级选择的某些数据影响之后的选择
    this.initCourseTimes();
    if (this.formGroup.get('clazzIds')?.value !== null) {
      this.isShowTeacherSelect = true;
    } else {
      this.isShowTeacherSelect = false;
    }
  }
  onCourseIdChange(): void {
    this.isShowTeacherSelect = false;
    // 课程有变动，courseTimes要清空， 防止之前的课程选择的某些数据影响之后的选择
    this.initCourseTimes();
    this.formGroup.get('clazzIds')?.setValue([]);

    if (this.formGroup.get('courseId')?.value === '') {
      // 没有选择课程， 将clazz_id设为null
      this.formGroup.get('clazzIds')?.setValue(null);
    } else {
      // 选择课程，请求已选择该课程的班级clazzIds, 并在clazzes中筛选掉这些班级
      this.clazzService.clazzesHaveSelectCourse(this.formGroup.get('courseId')?.value)
        .subscribe(clazzIds => {
          console.log('clazzIds', clazzIds);
          this.clazzes = this.clazzesToBeScreened.filter(clazz => !clazzIds.includes(clazz.id));
        }, error => {
          console.log('error', error);
        });
    }
  }

  onTeacherIdChange(): void {
    // 教师有变动，courseTimes要清空， 防止之前的班级选择的某些数据影响之后的选择
    this.initCourseTimes();
  }
}
