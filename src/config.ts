import { join, resolve } from 'path';
import { readdirSync } from 'fs';

// args
export const args = require('minimist')(process.argv);
export const showAllFile = Boolean(args['a']);
export const shareDir = Boolean(args['r']);
export const writeMode = Boolean(args['w']);
export const forceMode = Boolean(args['f']);
export const releaseMode = Boolean((process as any).pkg?.entrypoint);
export const exportPort = args['p'] || 8080;
export const cwd = resolve(__dirname, '../', releaseMode ? '../' : '');
export const filePath = args['_'][2] ? resolve(args['_'][2]) : resolve(process.execPath, '../');

// path
export const PUBLIC_PATH = resolve(cwd, './public');
export const VIEW_PATH = resolve(cwd, './src/views');
export const STYLE_PATH = resolve(cwd, './src/style');
export const PUBLIC_RESOURCE_PATH_LIST = (function flatDir(filePath = ''): Array<string> {
  const resFileList: Array<string> = [];
  const files = readdirSync(join(PUBLIC_PATH, filePath), { withFileTypes: true });
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
})();