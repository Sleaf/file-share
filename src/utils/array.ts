import _ from 'lodash';
import { EmptyArray } from '@/constants/literal';
import { SortOrder } from '@/constants/enums';

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

/*
 * 根据取数逻辑进行比较
 * */
const compareValue = <T extends string | number>(aValue: T, bValue: T) => {
  switch (typeof aValue === typeof bValue && typeof aValue) {
    case 'string':
      const compBoolean = aValue > bValue;
      const res = compBoolean ? 1 : -1;
      return aValue === bValue
        ? 0 // 相等字符串返回
        : res;
    case 'number':
      return (aValue as number) - (bValue as number);
    default:
      return ((aValue as any) || Number.MIN_SAFE_INTEGER) - ((bValue as any) || Number.MIN_SAFE_INTEGER);
  }
};
export const toCompareSorter = (getPath: Nullable<string | string[]>, sortOrder: SortOrder) => (a, b) => {
  const aValue = getPath != null ? _.get(a, getPath) : a;
  const bValue = getPath != null ? _.get(b, getPath) : b;
  return sortOrder === SortOrder.ASC ? compareValue(aValue, bValue) : compareValue(bValue, aValue);
};
