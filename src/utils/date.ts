import dateFormat from 'date-fns/format';

/*
 * 获取格式化的时间
 * */
export const toDateString = (time = new Date(), format = 'MM/dd-HH:mm:ss.SSS') => dateFormat(time, format);
