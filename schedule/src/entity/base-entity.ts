export class BaseEntity {
  id: number;
  createTime: number;
  updateTime: number;

  constructor(data = {} as {
    id: number, create_time: number, update_time: number
  }) {
    this.id = data.id;
    this.createTime = data.create_time;
    this.updateTime = data.update_time;
  }
}
