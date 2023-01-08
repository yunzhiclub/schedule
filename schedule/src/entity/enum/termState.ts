/**
 * 学期状态
 */
import {StateEnum} from './stateEnum';

export type TermState = true | false;

/**
 * freezing是正在进行时，指正在冻结中。
 * 在当前项目中指：由正常变为冻结的瞬间。
 * 比如正在加载中，我们会使用单词loading
 * 而在这应该用过去分启frozen，表示已经被冻结的
 */
export const TERM_STATE: {[index: string]: StateEnum<TermState>} = {
  frozen: {
    value: false as TermState,
    description: '未激活',
    clazz: 'secondary'
  } as StateEnum<TermState>,
  normal: {
    value: true as TermState,
    description: '已激活',
    clazz: 'success'
  } as StateEnum<TermState>,
};
