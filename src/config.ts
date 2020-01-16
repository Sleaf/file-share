import { join, resolve } from 'path';
import { readdirSync } from 'fs';

// args
export const args = require('minimist')(process.argv);
export const filePath = resolve(args['_'][2] || '.');
export const showAllFile = Boolean(args['a']);
export const shareDir = Boolean(args['r']);
export const exportPort = args['p'] || 8080;

// config
export const publicPath = resolve('./public');
const flatDir = (filePath = ''): Array<string> => {
  const resFileList: Array<string> = [];
  const files = readdirSync(join(publicPath, filePath), { withFileTypes: true });
  for (const fileStat of files) {
    const curPath = `${filePath}/${fileStat.name}`;
    if (fileStat.isDirectory()) {
      const fileList = flatDir(curPath).map(item => filePath + item);
      resFileList.push(...fileList);
    } else {
      resFileList.push(curPath);
    }
  }
  return resFileList;
};
export const publicResourceList = flatDir();