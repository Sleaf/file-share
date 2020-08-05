import chalk from 'chalk';
import { toDateString } from '@/utils/date';

/*
 * 客户端访问log
 * */
export const getCommonLogString = (ip: string) => `${chalk.blue(toDateString())} ${chalk.cyan(ip)}`;

/*
 * 错误log
 * */
export const errMsg = (...arg: Array<any>) => console.log(chalk.red(...arg));
