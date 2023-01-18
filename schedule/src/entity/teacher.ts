/**
 * 教师
 */
import {Schedule} from './schedule';

export class Teacher {
  id: number;
  name: string | undefined;
  sex: boolean | undefined;
  phone: string | undefined;
  schedules1: Schedule[] | undefined;
  schedules2: Schedule[] | undefined;
  schedules: Schedule[] | undefined;
  constructor(data = {} as {
    id?: number
    name?: string,
    sex?: boolean,
    phone?: string
    schedules1?: Schedule[]
    schedules2?: Schedule[]
  }) {
    this.id = (data.id as number);
    this.name = data.name;
    this.sex = data.sex;
    this.phone = data.phone;
    this.schedules1 = data.schedules1 ? data.schedules1 : [];
    this.schedules2 = data.schedules2 ? data.schedules2 : [];
    this.schedules = Array.from(new Set([...this.schedules1, ...this.schedules2]));
  }

  getHours(): number {
    let counter = 0;
    this.schedules?.forEach(schedule => {
      if (schedule.dispatches) {
        counter = schedule.dispatches.length + counter;
      }
    });
    return counter;
  }
}
