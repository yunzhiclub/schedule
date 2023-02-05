import {Schedule} from './schedule';

/**
 * 课程
 */
export class Course {
  id: number;
  name: string | undefined;
  hours: number | undefined;
  schedules: Schedule[] = [];
  constructor(data = {} as {
    id?: number
    name?: string,
    hours?: number,
    schedules?: Schedule[],
  }) {
    this.id = (data.id as number);
    this.name = data.name;
    this.hours = data.hours;
    this.schedules = data.schedules ? data.schedules : [];
  }
}
