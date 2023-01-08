/**
 * 学期
 */
import {Assert} from '../common/utils';

export class Term {

  public static ACTIVATE = true;
  public static NOT_ACTIVATE = false;

  id: number | undefined;
  name: string | undefined;
  state: boolean | undefined;
  startTime = '';
  endTime = '';
  constructor(data = {} as {
    id?: number
    name?: string,
    state?: boolean,
    startTime?: string,
    endTime?: string,
  }) {
    this.id = data.id;
    this.name = data.name;
    this.state = data.state;
    this.startTime = data.startTime ? data.startTime : '';
    this.endTime = data.endTime ? data.endTime : '';
  }

  getName(): string {
    Assert.isDefined(this.name, '不满足获取name的前提条件');
    return this.name!;
  }
  getState(): boolean {
    Assert.isDefined(this.state, '不满足获取state的前提条件');
    return this.state!;
  }
  getStartTime(): string {
    Assert.isDefined(this.startTime, '不满足获取startTime的前提条件');
    return this.startTime!;
  }
  getEndTime(): string {
    Assert.isDefined(this.endTime, '不满足获取endTime的前提条件');
    return this.endTime!;
  }

}
