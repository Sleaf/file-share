import Express from 'express';
import { join } from 'path';
import { createReadStream, readdir, stat, statSync } from 'fs';
import { Response } from 'express-serve-static-core';
import { filePath, shareDir } from './args';
import { getCommonLogString } from './utils';

const router = Express.Router();

const loadFiles = (res: Response, dirPath: string) => readdir(dirPath, (err, results) => {
  if (err) throw err;
  const directories = [];
  const files = [];
  for (const file of results) {
    const fileStat = statSync(join(dirPath, file));
    if (fileStat.isDirectory()) {
      directories.push(file + '/');
    } else if (fileStat.isFile()) {
      files.push(file);
    }
  }
  res.render('index', {
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
        return createReadStream(downloadFile).pipe(res);
      default:
        res.status(404);
        return res.render('error', {
          message: 'File or directory was not found!',
        });
    }
  });
});

export default router;
