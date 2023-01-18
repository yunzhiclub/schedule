import {Assert} from '../common/utils';
import {Student} from "./student";

/**
 * 班级
 */
export class Clazz {
  id: number;
  name: string | undefined;
  entranceDate = '';
  students = [] as Student[];

  constructor(data = {} as {
    id?: number,
    name?: string,
    entranceDate?: string
    students?: Student[]
  }) {
    this.id = (data.id as number);
    this.name = data.name;
    this.entranceDate = data.entranceDate ? data.entranceDate : '';
    this.students = data.students ? data.students : [];
  }
  getName(): string {
    Assert.isDefined(this.name, '不满足获取name的前提条件');
    return this.name!;
  }
  getId(): number {
    Assert.isDefined(this.id, '不满足获取id的前提条件');
    return this.id!;
  }
  getEntranceDate(): string {
    Assert.isDefined(this.entranceDate, '不满足获取entranceDate的前提条件');
    return this.entranceDate!;
  }
  getStudentNumber(): number {
    return this.students.length;
  }
}
