/**
 * 带有描述信息的枚举类型
 */
export interface StateEnum<T> {
  value: T;
  description: string;
  clazz: string;
}
