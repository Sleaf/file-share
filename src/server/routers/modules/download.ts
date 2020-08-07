import fs from 'fs';
import { Request, Response } from 'express-serve-static-core';
import { getFileStat } from '@/server/utils/file';
import { getCommonLogString } from '@/server/utils/log';
import { toAutoUnit } from '@/utils/number';

export default async (req: Request, res: Response) => {
  const targetFile = req.query.targetFile as string;
  const fileStat = await getFileStat(targetFile);
  if (fileStat?.isFile()) {
    const startTime = Date.now();
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Length': fileStat?.size,
    });
    console.log(getCommonLogString(req.ip), '开始下载:', targetFile);
    fs.createReadStream(targetFile)
      .on('close', () => {
        const rate = Number(fileStat?.size) / ((Date.now() - startTime) / 1000);
        console.log(getCommonLogString(req.ip), '下载完成:', targetFile, `---- ${toAutoUnit(rate)}B/s`);
      })
      .pipe(res);
    return;
  }
  res.status(403);
  res.end();
};
