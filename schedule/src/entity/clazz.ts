import {Assert} from '../common/utils';

/**
 * 班级
 */
export class Clazz {
  id: number | undefined;
  name: string | undefined;
  entranceDate = '';

  constructor(data = {} as {
    id?: number,
    name?: string,
    entranceDate?: string
  }) {
    this.id = data.id;
    this.name = data.name;
    this.entranceDate = data.entranceDate ? data.entranceDate : '';
  }
  getName(): string {
    Assert.isDefined(this.name, '不满足获取name的前提条件');
    return this.name!;
  }
  getEntranceDate(): string {
    Assert.isDefined(this.entranceDate, '不满足获取entranceDate的前提条件');
    return this.entranceDate!;
  }
}
