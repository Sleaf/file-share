import Express from 'express';
import { join } from 'path';
import { createReadStream, readdir, statSync } from 'fs';
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
  const fileParam = decodeURI(req.path);
  const downloadFile = join(filePath, fileParam);
  const fileStat = statSync(downloadFile);
  if (fileStat.isDirectory()) {
    // 打开目录
    return loadFiles(res, downloadFile);
  } else if (fileStat.isFile()) {
    console.log(getCommonLogString(req.ip), '下载文件:', downloadFile);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Length': fileStat.size,
    });
    return createReadStream(downloadFile).pipe(res);
  } else {
    return res.end(404);
  }
});

export default router;
