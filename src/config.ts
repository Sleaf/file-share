import { join, resolve } from 'path';
import { readdirSync } from 'fs';

// args
export const args = require('minimist')(process.argv);
export const filePath = resolve(args['_'][2] || '.');
export const shareDir = Boolean(args['r']);
export const exportPort = args['p'] || 8080;

// config
export const publicPath = resolve('./public');
const flatDir = (filePath = ''): Array<string> => {
  const resFileList = [];
  const files = readdirSync(join(publicPath, filePath), { withFileTypes: true });
  for (const fileStat of files) {
    const curPath = `${filePath}/${fileStat.name}`;
    switch (true) {
      case fileStat.isDirectory():
        const fileList = flatDir(curPath).map(item => filePath + item);
        resFileList.push(...fileList);
        break;
      case fileStat.isFile():
        resFileList.push(curPath);
        break;
    }
  }
  return resFileList;
};
export const publicResourceList = flatDir();