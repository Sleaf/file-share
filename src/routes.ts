import Express from 'express';
import { join } from 'path';
import { createReadStream, readdir, statSync } from 'fs';
import { Response } from 'express-serve-static-core';
import { filePath, shareDir } from './args';

const router = Express.Router();

function loadFiles(res: Response, dirPath: string) {
  readdir(dirPath, function (err, results) {
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
}

/* GET files listing. */
router.get('/', (req, res) => loadFiles(res, filePath));

router.get('*', function (req, res) {
  // 实现文件下载
  const fileParam = decodeURI(req.path);
  const downloadFile = join(filePath, fileParam);
  const fileStat = statSync(downloadFile);
  if (fileStat.isDirectory()) {
    console.log('打开目录:', downloadFile);
    loadFiles(res, downloadFile);
  } else if (fileStat.isFile()) {
    console.log('下载文件:', downloadFile);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Length': fileStat.size,
    });
    createReadStream(downloadFile).pipe(res);
  } else {
    res.end(404);
  }
});


export default router;
