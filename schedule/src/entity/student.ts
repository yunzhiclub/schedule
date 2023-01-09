/**
 * 学生
 */
import {Clazz} from './clazz';
import {Assert} from '../common/utils';

export class Student {
  id: number | undefined;
  name: string | undefined;
  sex: boolean | undefined;
  sno: string | undefined;
  clazz: Clazz | null;
  constructor(data = {} as {
    id?: number
    name?: string,
    sex?: boolean,
    sno?: string,
    clazz?: Clazz,
  } as Student) {
    this.id = data.id;
    this.name = data.name;
    this.sex = data.sex;
    this.sno = data.sno;
    this.clazz = data.clazz!;
  }

  getName(): string {
    Assert.isDefined(this.name, '不满足获取name的前提条件');
    return this.name!;
  }

  getSex(): boolean {
    Assert.isDefined(this.sex, '不满足获取sex的前提条件');
    return this.sex!;
  }

  getSno(): string {
    Assert.isDefined(this.sno, '不满足获取sno的前提条件');
    return this.sno!;
  }

  getClazz(): Clazz {
    Assert.isDefined(this.clazz, '不满足获取clazz的前提条件');
    return this.clazz!;
  }
}
