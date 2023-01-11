/**
 * 用户
 */
import {Assert} from '../common/utils';

export class User {
  id: number | undefined;
  name: string | undefined;
  phone: string | undefined;
  password: string | undefined;
  constructor(data = {} as {
    id?: number
    name?: string,
    phone?: string,
    password?: string,
  }) {
    this.id = data.id;
    this.name = data.name;
    this.phone = data.phone;
    this.password = data.password;
  }

  getName(): string {
    Assert.isDefined(this.name, '不满足获取name的前提条件');
    return this.name!;
  }

  getPhone(): string {
    Assert.isDefined(this.phone, '不满足获取phone的前提条件');
    return this.phone!;
  }

  getPassword(): string {
    Assert.isDefined(this.password, '不满足获取password的前提条件');
    return this.password!;
  }

}
