import Express from 'express';
import { join, resolve } from 'path';
import { createReadStream, readdir, stat, statSync } from 'fs';
import { Response } from 'express-serve-static-core';
import { filePath, shareDir, showAllFile } from './config';
import { getCommonLogString, getTimeString } from './utils/log';
import { toAutoUnitSize } from './utils/number';

const router = Express.Router();

const loadFiles = (res: Response, dirPath: string) => readdir(dirPath, { withFileTypes: true }, (err, results) => {
  if (err) throw err;
  const fileDirents = showAllFile ? results : results.filter(file => !(/(^|\/)\.[^\/.]/g).test(file.name));
  const fileStats = fileDirents.map(file => {
    const fileState = statSync(resolve(dirPath, file.name));
    return ({
      name: file.name,
      isDirectory: file.isDirectory(),
      isFile: file.isFile(),
      size: toAutoUnitSize(fileState.size),
      lastModify: getTimeString(fileState.mtime, 'yyyy/MM/dd HH:mm:ss'),
    });
  });
  const directories = fileStats.filter(fileStat => fileStat.isDirectory);
  const files = fileStats.filter(fileStat => fileStat.isFile);
  res.render('main', {
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
          console.log(logPrefix, '下载完成:', downloadFile, `---- ${toAutoUnitSize(rate)}/s`);
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
