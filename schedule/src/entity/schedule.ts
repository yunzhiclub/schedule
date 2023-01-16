import {Assert} from '../common/utils';
import {Course} from './course';
import {Term} from './term';
import {Teacher} from './teacher';
import {Dispatch} from './dispatch';
import {Clazz} from './clazz';

/**
 * 排课
 */
export class Schedule {
  id: number;
  course = {} as Course;
  term = {} as Term;
  teacher1 = {} as Teacher;
  teacher2 = {} as Teacher;
  dispatches = [] as Dispatch[];
  clazzes = [] as Clazz[];
  constructor(data = {} as {
    id?: number,
    course?: Course,
    term?: Term,
    teacher1?: Teacher,
    teacher2?: Teacher,
    dispatches?: Dispatch[]
    clazzes?: Clazz[]
  }) {
    this.id = (data.id as number);
    this.course = data.course ? data.course : new Course();
    this.term = data.term ? data.term : new Term();
    this.teacher1 = data.teacher1 ? data.teacher1 : new Teacher();
    this.teacher2 = data.teacher2 ? data.teacher2 : new Teacher();
    this.dispatches = data.dispatches ? data.dispatches : [];
    this.clazzes = data.clazzes ? data.clazzes : [];
  }
  getCourse(): Course {
    Assert.isDefined(this.course, '不满足获取course的前提条件');
    return this.course!;
  }
  getTerm(): Term {
    Assert.isDefined(this.term, '不满足获取term的前提条件');
    return this.term!;
  }
  getTeacher1(): Teacher {
    Assert.isDefined(this.teacher1, '不满足获取teacher1的前提条件');
    return this.teacher1!;
  }
  getTeacher2(): Teacher {
    Assert.isDefined(this.teacher2, '不满足获取teacher2的前提条件');
    return this.teacher2!;
  }
  getDispatches(): Dispatch[] {
    Assert.isDefined(this.dispatches, '不满足获取dispatches的前提条件');
    return this.dispatches!;
  }
  getClazzes(): Clazz[] {
    Assert.isDefined(this.clazzes, '不满足获取clazzes的前提条件');
    return this.clazzes!;
  }
  getId(): number {
    Assert.isDefined(this.id, '不满足获取id的前提条件');
    return this.id!;
  }

}
