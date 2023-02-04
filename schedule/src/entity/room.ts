import {Dispatch} from './dispatch';

/**
 * 教室
 */
export class Room {
  id: number | undefined;
  name: string | undefined;
  capacity: number | undefined;
  dispatches: Dispatch[] = [];
  constructor(data = {} as {
    id?: number
    name?: string,
    capacity?: number,
    dispatches?: Dispatch[],
  }) {
    this.id = data.id;
    this.name = data.name;
    this.capacity = data.capacity;
    this.dispatches = data.dispatches ? data.dispatches : [];
  }
}
