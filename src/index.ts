import { resolve } from 'path';
import Express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import os from 'os';
import chalk from 'chalk';
import routes from './routes';
import { exportPort, filePath, publicPath, publicResourceList, shareDir } from './config';
import { getCommonLogString } from './utils';

const app = Express();

// network
const ips = os.networkInterfaces();
const avaliableIpv4 = Object.values(ips)
  .map(item => item.filter(item => item.family === 'IPv4' && !item.internal)) // 只输出外网地址
  .reduce((acc, item) => acc.concat(item), []);
const addressStr = avaliableIpv4.map(({ address }) => `http://${address}:${exportPort}`).join('\n\t\t');
console.log('分享地址为：', `\t${addressStr}`);
console.log('分享目录为：', `\t${filePath}（${shareDir ? '' : '不'}含文件夹）`);

// view engine setup
app.set('views', resolve('./views'));
app.set('view engine', 'pug');

app.use(morgan(
  (tokens, req, res) => {
    const { ip, method, path } = req;
    const { statusCode } = res;
    const stateStr = (statusCode < 400 ? chalk.green : chalk.red)(`${statusCode}-${method}`);
    return `${getCommonLogString(ip)} ${stateStr} ${path} `;
  },
  {
    skip: (req) => publicResourceList.some(item => (req.url === item)),
  },
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(Express.static(publicPath));

// pages
app.use('/', routes);

app.listen(exportPort);
