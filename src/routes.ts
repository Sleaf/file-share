import Express from 'express';
import { join } from 'path';
import { createReadStream, Dirent, readdir, stat } from 'fs';
import { Response } from 'express-serve-static-core';
import { filePath, shareDir } from './config';
import { getCommonLogString } from './utils/log';
import { toAutoUnit } from './utils/number';

const router = Express.Router();

const loadFiles = (res: Response, dirPath: string) => readdir(dirPath, { withFileTypes: true }, (err, results) => {
  if (err) throw err;
  const directories: Array<Dirent> = results.filter(fileStat => fileStat.isDirectory());
  const files: Array<Dirent> = results.filter(fileStat => fileStat.isFile());
  res.render('index', {
    upperDir: dirPath === filePath ? null : `${join(dirPath, '..').slice(filePath.length)}/`,
    directories: shareDir ? directories : [],
    files,
  });
});

/* GET files listing. */
router.get('/', (req, res) => loadFiles(res, filePath));

router.get('*', (req, res) => {
  // 实现文件下载
  const downloadFile = join(filePath, decodeURI(req.path));
  const logPrefix = getCommonLogString(req.ip);
  stat(downloadFile, (err, fileStat) => {
    switch (true) {
      case fileStat?.isDirectory():
        return loadFiles(res, downloadFile);
      case fileStat?.isFile():
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Length': fileStat.size,
        });
        console.log(logPrefix, '下载文件:', downloadFile);
        const startTime = Date.now();
        const closeHandler = () => {
          const rate = fileStat.size / ((Date.now() - startTime) / 1000);
          console.log(logPrefix, '下载完成:', downloadFile, `${toAutoUnit(rate)}/s`);
        };
        return createReadStream(downloadFile)
          .on('close', closeHandler)
          .pipe(res);
      default:
        res.status(404);
        return res.render('error', {
          message: 'File or directory was not found!',
        });
    }
  });
});

export default router;
