/**
 * 班级
 */
export class Clazz {
  id: number | undefined;
  name: string | undefined;
  entranceData: string | undefined;

  constructor(data = {} as {
    id?: number,
    name?: string,
    entranceData?: string
  }) {
    this.id = data.id;
    this.name = data.name;
    this.entranceData = data.entranceData;
  }
}
