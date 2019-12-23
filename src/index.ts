import { resolve } from 'path';
import Express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './routes';
import { filePath, shareDir, sharePort } from './args';
import os from 'os';

const app = Express();

// network
const ips = os.networkInterfaces();
const avaliableIpv4 = Object.values(ips)
  .map(item => item.filter(item => item.family === 'IPv4' && !item.internal)) // 只输出外网地址
  .reduce((acc, item) => acc.concat(item), []);
for (const network of avaliableIpv4) {
  console.log('分享地址为：', `http://${network.address}:${sharePort}`);
}
console.log('分享目录为：', filePath, shareDir ? '（含文件夹）' : '（不含文件夹）');

// view engine setup
app.set('views', resolve('./views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
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
