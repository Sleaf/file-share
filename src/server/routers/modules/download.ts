import fs, { promises as fsPromise } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express-serve-static-core';
import { isUnixHiddenFilename } from '@/server/utils/file';
import { filePath, showAllFile } from '@/config';
import { getCommonLogString } from '@/server/utils/log';
import { toAutoUnit } from '@/utils/number';
import { toSafeFilePath } from '@/utils/string';

export default async (req: Request, res: Response) => {
  const receivedPath = toSafeFilePath(decodeURI(req.query.path as string));
  const targetFile = join(filePath, receivedPath);
  try {
    const fileStat = await fsPromise.stat(targetFile);
    switch (true) {
      case !showAllFile && isUnixHiddenFilename(targetFile):
        console.log(getCommonLogString(req.ip), '访问隐藏文件被禁止:', targetFile);
        res.status(404);
        res.end();
        break;
      case fileStat?.isFile():
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Length': fileStat.size,
        });
        console.log(getCommonLogString(req.ip), '下载文件:', targetFile);
        const startTime = Date.now();
        fs.createReadStream(targetFile)
          .on('close', () => {
            const rate = fileStat.size / ((Date.now() - startTime) / 1000);
            console.log(getCommonLogString(req.ip), '下载完成:', targetFile, `---- ${toAutoUnit(rate)}B/s`);
          })
          .pipe(res);
        break;
      default:
    }
  } catch (e) {
    res.status(404);
    res.end();
  }
};
