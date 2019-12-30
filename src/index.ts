import { resolve } from 'path';
import Express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import os from 'os';
import routes from './routes';
import { filePath, shareDir, sharePort } from './args';
import { getCommonLogString } from './utils';
import chalk from 'chalk';

const app = Express();

// network
const ips = os.networkInterfaces();
const avaliableIpv4 = Object.values(ips)
  .map(item => item.filter(item => item.family === 'IPv4' && !item.internal)) // 只输出外网地址
  .reduce((acc, item) => acc.concat(item), []);
const addressStr = avaliableIpv4.map(({ address }) => `http://${address}:${sharePort}`).join('\n\t\t');
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
    skip: (req, res) => /\.(css|png|ico)$/.test(req.url),
  },
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(Express.static(resolve('./public')));

// pages
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new Error('Not Found'));
});

app.on('error', (e) => console.error(e));

app.listen(sharePort);
module.exports = app;
