import {Assert} from '../common/utils';
import {Schedule} from './schedule';
import {Room} from './room';

/**
 * 调度
 */
export class Dispatch {
  id: number;
  week: number | undefined;
  day: number | undefined;
  lesson: number | undefined;
  schedule = {} as Schedule;
  rooms = [] as Room[];

  constructor(data = {} as {
    id?: number,
    week?: number,
    day?: number,
    lesson?: number,
    schedule?: Schedule,
    rooms?: Room[],
  }) {
    this.id = (data.id as number);
    this.week = data.week!;
    this.day = data.day!;
    this.lesson = data.lesson!;
    this.schedule = data.schedule!;
    this.rooms = data.rooms!;
  }
  getSchedule(): Schedule {
    Assert.isDefined(this.schedule, '不满足获取schedule的前提条件');
    return this.schedule!;
  }
  getId(): number {
    Assert.isDefined(this.id, '不满足获取id的前提条件');
    return this.id!;
  }
  getWeek(): number {
    Assert.isDefined(this.week, '不满足获取week的前提条件');
    return this.week!;
  }
  getRooms(): Room[] {
    Assert.isDefined(this.rooms, '不满足获取rooms的前提条件');
    return this.rooms!;
  }
  getDay(): number {
    Assert.isDefined(this.day, '不满足获取day的前提条件');
    return this.day!;
  }
  getLesson(): number {
    Assert.isDefined(this.lesson, '不满足获取lesson的前提条件');
    return this.lesson!;
  }
}
