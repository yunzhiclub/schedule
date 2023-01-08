/**
 * 学期
 */
export class Term {
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
}
