import Express from 'express';
import morgan from 'morgan';
import _ from 'lodash';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import os from 'os';
import fs from 'fs';
import chalk from 'chalk';
import fileUpload from 'express-fileupload';
import {
  exportPort,
  FE_BUILD_PATH,
  FE_INDEX_PATH,
  filePath,
  forceMode,
  shareDir,
  showAllFile,
  VERSION,
  writeMode,
} from '@/config';
import routes from './routers';
import { errMsg, getCommonLogString } from './utils/log';

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload({ createParentPath: true }));
app.use(
  morgan(
    (tokens, req, res) => {
      const { ip, method, path } = req;
      const { statusCode } = res;
      const stateStr = (statusCode < 400 ? chalk.green : chalk.red)(`${statusCode}-${method}`);
      return `${getCommonLogString(ip)} ${stateStr} ${path} `;
    },
    {
      skip(req) {
        switch (true) {
          case req.url?.startsWith('/favicon.ico'):
          case req.url?.startsWith('/resources'): // 静态资源
          case req.url?.startsWith('/status'):
          case req.url?.startsWith('/list'):
          case req.res?.getHeader('Content-Type') === 'application/octet-stream': // 下载的文件
            return true;
          default:
            return false;
        }
      },
    },
  ),
);

// pages
app.use('/api', routes);
app.use(Express.static(FE_BUILD_PATH));
app.use('*', (req, res) =>
  fs.readFile(FE_INDEX_PATH, 'utf-8', (err, content) => {
    if (err) {
      res.status(404);
      res.end();
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
      });
      res.end(content);
    }
  }),
);

// running
app.listen(exportPort, () => {
  console.clear();
  const shareAddress = availableIpv4.reduce(
    (acc, addr, index) => ({
      ...acc,
      [`分享地址_${index + 1}`]: addr && `http://${addr.address}:${exportPort}`,
    }),
    {},
  );
  console.table({
    版本: `v${VERSION}`,
    ...shareAddress,
    分享目录: filePath,
    '显示隐藏文件夹（-a）': showAllFile,
    '显示文件夹（-r）': shareDir,
    '允许上传（-w）': writeMode,
    '允许上传并覆盖文件（-wf）': forceMode,
  });
});
