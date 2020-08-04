import _ from 'lodash';
import { EmptyArray } from '@/constants/literal';

/*
 * 判断是否为非空数组
 * */
export const isNotEmptyArray = <T extends any>(arr?: T) => Array.isArray(arr) && arr.length > 0;

/*
 * 像lodash#get一样调用，返回值一定是个数组（可能为空）
 * */
export const safeGetArray = <T extends any>(
  source: any,
  path: string | number | symbol | Array<string | number | symbol>,
): Array<T> => {
  const value = _.get(source, path);
  return isNotEmptyArray(value) ? value : EmptyArray;
};

/*
 * dfs完全拍平Array
 * */
export function flattenAll<T, K extends keyof T>(list: Array<T> = [], childrenKey: K): Array<T> {
  const result: Array<T> = [];
  for (const item of list) {
    const children: Array<T> = (item as any)[childrenKey];
    if (isNotEmptyArray(children)) {
      result.push(...flattenAll(children, childrenKey));
    } else {
      result.push(item);
    }
  }
  return result;
}

/*
 * 将一个数组转换为 label/value 形式的数组，label和value都是item本身
 * */
export const toLVArray = <T>(array: Array<T>) =>
  isNotEmptyArray(array) ? array.map(item => ({ label: item, value: item })) : ([] as Array<{ label: T; value: T }>);
