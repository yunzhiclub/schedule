/**
 * 教师
 */
export class Room {
  id: number | undefined;
  name: string | undefined;
  capacity: number | undefined;
  constructor(data = {} as {
    id?: number
    name?: string,
    capacity?: number,
  }) {
    this.id = data.id;
    this.name = data.name;
    this.capacity = data.capacity;
  }
}
