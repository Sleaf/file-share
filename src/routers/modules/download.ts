import { createReadStream, stat } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express-serve-static-core';
import { loadFiles } from '../../utils/file';
import { filePath, shareDir, writeMode } from '../../config';
import { getCommonLogString } from '../../utils/log';
import { toAutoUnit } from '../../utils/number';

export default (req: Request, res: Response) => {
  const downloadFile = join(filePath, decodeURI(req.path));
  const logPrefix = getCommonLogString(req.ip);
  stat(downloadFile, async (err, fileStat) => {
    switch (true) {
      case fileStat?.isDirectory():
        const { directories, files } = await loadFiles(downloadFile);
        return res.render('main', {
          upperDir: downloadFile === filePath ? null : `${join(downloadFile, '..').slice(filePath.length)}/`,
          directories: shareDir ? directories : [],
          files,
          allowUpload: writeMode,
        });
      case fileStat?.isFile():
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Length': fileStat.size,
        });
        console.log(logPrefix, '下载文件:', downloadFile);
        const startTime = Date.now();
        const closeHandler = () => {
          const rate = fileStat.size / ((Date.now() - startTime) / 1000);
          console.log(logPrefix, '下载完成:', downloadFile, `---- ${toAutoUnit(rate)}B/s`);
        };
        return createReadStream(downloadFile).on('close', closeHandler).pipe(res);
      default:
        res.status(404);
        return res.render('error', {
          message: 'File or directory was not found!',
        });
    }
  });
}