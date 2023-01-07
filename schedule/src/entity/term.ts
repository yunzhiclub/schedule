import {BaseEntity} from './base-entity';

export class Term extends BaseEntity {
  name: string;
  state: number;
  startTime: string;
  endTime: string;
  constructor(data = {} as {
    name: string, state: number, startTime: string, endTime: string
  }) {
    super();
    this.name = data.name;
    this.state = data.state;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
  }
}
