import Express from 'express';
import stylus from 'stylus';
import morgan from 'morgan';
import _ from 'lodash';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import os from 'os';
import chalk from 'chalk';
import fileUpload from 'express-fileupload';
import ncp from 'ncp'
import routes from './routes';
import { exportPort, filePath, PUBLIC_PATH, publicResourceList, shareDir, VIEW_PATH } from './config';
import { errMsg, getCommonLogString } from './utils/log';

const app = Express();

// copy js
ncp(resolve('./views/js/'), resolve('./public/js/'), err => {
    if (err) {
        console.error(err);
        return
    }
    console.log('完成 JS 文件复制')
})

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
console.log('分享地址为：', `\t${addressStr}`);
console.log('分享目录为：', `\t${filePath}（${shareDir ? '' : '不'}含文件夹）`);

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
      publicResourceList.some(item => (req.url === item)) // 静态资源
      || req.res?.getHeader('Content-Type') === 'application/octet-stream' // 下载的文件
    ),
  },
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware({
  src: VIEW_PATH,
  dest: PUBLIC_PATH,
  compress: true,
}));
app.use(Express.static(PUBLIC_PATH));
app.use(fileUpload({
    createParentPath: true
}))

// pages
app.use('/', routes);

app.listen(exportPort);
