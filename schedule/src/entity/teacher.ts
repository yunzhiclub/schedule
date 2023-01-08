/**
 * 教师
 */
export class Teacher {
  id: number | undefined;
  name: string | undefined;
  sex: boolean | undefined;
  phone: string | undefined;
  constructor(data = {} as {
    id?: number
    name?: string,
    sex?: boolean,
    phone?: string
  }) {
    this.id = data.id;
    this.name = data.name;
    this.sex = data.sex;
    this.phone = data.phone;
  }
}
