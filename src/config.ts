import { resolve } from 'path';

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
export const FE_BUILD_PATH = resolve(BUILD_PATH, './client');
export const FE_RESOURCE_PATH = resolve(FE_BUILD_PATH, './resources');
export const FE_INDEX_PATH = resolve(FE_BUILD_PATH, './index.html');

export const VERSION = pkgMode
  ? require(resolve(ROOT_PATH, './package.json')).version
  : process.env.npm_package_version;
