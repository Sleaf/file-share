import fs, { promises as fsPromise } from 'fs';
import { join, relative } from 'path';
import { Request, Response } from 'express-serve-static-core';
import { isUnixHiddenFilename, loadFiles } from '@/utils/file';
import { filePath, shareDir, showAllFile, writeMode } from '@/config';
import { getCommonLogString } from '@/utils/log';
import { toAutoUnit } from '@/utils/number';

export default async (req: Request, res: Response) => {
  const receivedPath = decodeURI(req.path).replace(/\.\.\//g, '');
  const targetFile = join(filePath, receivedPath);
  let fileStat;
  try {
    fileStat = await fsPromise.stat(targetFile);
  } catch (e) {
  }
  switch (true) {
    case !showAllFile && isUnixHiddenFilename(targetFile):
      console.log(getCommonLogString(req.ip), '访问隐藏文件被禁止:', targetFile);
      break;
    case fileStat?.isDirectory():
      const { directories, files } = await loadFiles(targetFile);
      return res.render('main', {
        upperDir: relative(targetFile, filePath) === '' ? null : `${join(targetFile, '..').slice(filePath.length)}/`,
        directories: shareDir ? directories : [],
        files,
        allowUpload: writeMode,
      });
    case fileStat?.isFile():
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Length': fileStat.size,
      });
      console.log(getCommonLogString(req.ip), '下载文件:', targetFile);
      const startTime = Date.now();
      const closeHandler = () => {
        const rate = fileStat.size / ((Date.now() - startTime) / 1000);
        console.log(getCommonLogString(req.ip), '下载完成:', targetFile, `---- ${toAutoUnit(rate)}B/s`);
      };
      return fs.createReadStream(targetFile).on('close', closeHandler).pipe(res);
    default:
  }
  res.status(404);
  return res.render('error', {
    message: 'File or directory was not found!',
  });
}