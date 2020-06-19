import Express from 'express';
import stylus from 'stylus';
import morgan from 'morgan';
import _ from 'lodash';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import os from 'os';
import chalk from 'chalk';
import nib from 'nib';
import fileUpload from 'express-fileupload';
import routes from './routers';
import { errMsg, getCommonLogString } from './utils/log';
import {
  exportPort,
  filePath,
  forceMode,
  PUBLIC_PATH,
  PUBLIC_RESOURCE_PATH_LIST,
  shareDir,
  showAllFile,
  STYLE_PATH,
  VIEW_PATH,
  writeMode,
} from './config';

const app = Express();

// network
const ips = os.networkInterfaces();
const availableIpv4 = _.flatten(Object.values(ips))
  .filter(item => item != null)
  .filter(item => item && item.family === 'IPv4' && !item.internal);
// 如果获取不到网络地址则退出
if (availableIpv4.length < 1) {
  errMsg('未找到可用的内网地址，请检查网络连接后再试。');
  process.exit();
}
const addressStr = availableIpv4.map(item => item && `http://${item.address}:${exportPort}`).join('\n\t\t');

// view engine setup
app.set('views', VIEW_PATH);
app.set('view engine', 'pug');

// middleware
app.use(morgan(
  (tokens, req, res) => {
    const { ip, method, path } = req;
    const { statusCode } = res;
    const stateStr = (statusCode < 400 ? chalk.green : chalk.red)(`${statusCode}-${method}`);
    return `${getCommonLogString(ip)} ${stateStr} ${path} `;
  },
  {
    skip: (req) => (
      PUBLIC_RESOURCE_PATH_LIST.some(item => (req.url === item)) // 静态资源
      || req.res?.getHeader('Content-Type') === 'application/octet-stream' // 下载的文件
    ),
  },
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware({
  src: STYLE_PATH,
  dest: PUBLIC_PATH,
  compress: true,
  compile: (str, path) =>
    stylus(str)
      .set('filename', path)
      .set('compress', true)
      .use(nib())
      .import('nib'),
}));
app.use(Express.static(PUBLIC_PATH));
app.use(fileUpload({
  createParentPath: true,
}));

// pages
app.use('/', routes);

// running
app.listen(exportPort, () => {
  console.clear();
  console.table({
    '分享地址': addressStr,
    '分享目录': filePath,
    '显示隐藏文件夹（-a）': showAllFile,
    '显示文件夹（-r）': shareDir,
    '允许上传（-w）': writeMode,
    '允许上传并覆盖文件（-wf）': forceMode,
  });
});
