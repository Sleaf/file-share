import dateFormat from 'date-fns/format';
import chalk from 'chalk';

export const getTimeString = (time = new Date(), format = 'yyyy/MM/dd_HH:mm:ss') => dateFormat(time, format);

export const getCommonLogString = (ip: string) => `${chalk.blue(getTimeString())} ${chalk.cyan(ip)}`;

export const errMsg = (...arg: Array<any>) => console.log(chalk.red(...arg));