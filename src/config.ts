import { join, resolve } from 'path';
import { readdirSync } from 'fs';

// args
export const args = require('minimist')(process.argv);

export const showAllFile = Boolean(args['a']);
export const shareDir = Boolean(args['r']);
export const writeMode = Boolean(args['w']);
export const forceMode = Boolean(args['f']);
export const pkgMode = Boolean((process as any).pkg?.entrypoint);
export const exportPort = args['p'] || 8080;
export const filePath = args['_'][2] ? resolve(args['_'][2]) : resolve(process.execPath, '../');

// path
export const ROOT_PATH = resolve(__dirname, '../');
export const BUILD_PATH = resolve(ROOT_PATH, './build');
export const BUILD_SRC_PATH = resolve(ROOT_PATH, './build-src');
export const SRC_PATH = resolve(ROOT_PATH, './src');
export const SRC_SEVER_PATH = resolve(SRC_PATH, './server');
export const SRC_CLIENT_PATH = resolve(SRC_PATH, './client');
export const PUBLIC_PATH = resolve(SRC_CLIENT_PATH, './public');
export const VIEW_PATH = resolve(SRC_CLIENT_PATH, './views');
export const STYLE_PATH = resolve(SRC_CLIENT_PATH, './style');
export const PUBLIC_RESOURCE_PATH_LIST = (function flatDir(path = ''): Array<string> {
  const resFileList: Array<string> = [];
  const files = readdirSync(join(PUBLIC_PATH, path), { withFileTypes: true });
  for (const fileStat of files) {
    const curPath = `${path}/${fileStat.name}`;
    if (fileStat.isDirectory()) {
      const fileList = flatDir(curPath).map(item => path + item);
      resFileList.push(...fileList);
    } else {
      resFileList.push(curPath);
    }
  }
  return resFileList;
})();

// info
export const VERSION = pkgMode
  ? require(resolve(ROOT_PATH, './package.json')).version
  : process.env.npm_package_version;
