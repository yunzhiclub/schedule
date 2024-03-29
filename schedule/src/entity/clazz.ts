import {Assert} from '../common/utils';

/**
 * 班级
 */
export class Clazz {
  id: number;
  name: string | undefined;
  studentNumber: number | undefined;
  entranceDate = '';

  constructor(data = {} as {
    id?: number,
    name?: string,
    entranceDate?: string,
    studentNumber?: number,
  }) {
    this.id = (data.id as number);
    this.name = data.name;
    this.studentNumber = data.studentNumber;
    this.entranceDate = data.entranceDate ? data.entranceDate : '';
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
    Assert.isDefined(this.studentNumber, '不满足获取studentNumber的前提条件');
    return this.studentNumber!;
  }
}
