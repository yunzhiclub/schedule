/**
 * 课程
 */
export class Course {
  id: number;
  name: string | undefined;
  hours: number | undefined;
  constructor(data = {} as {
    id?: number
    name?: string,
    hours?: number,
  }) {
    this.id = (data.id as number);
    this.name = data.name;
    this.hours = data.hours;
  }
}
