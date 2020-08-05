import { join } from 'path';
import { Request, Response } from 'express-serve-static-core';
import { ServerStatus } from '@/@types/transition';
import { filePath, forceMode, shareDir, showAllFile, VERSION, writeMode } from '@/config';
import { toSafeFilePath } from '@/utils/string';
import { getDirUpdateTime } from '@/server/utils/file';

export default async (req: Request, res: Response) => {
  const receivedPath = toSafeFilePath(decodeURI(req.query.path as string));
  const targetFile = join(filePath, receivedPath);
  const returnPayload: ServerStatus = {
    fileListUpdateTIme: (await getDirUpdateTime(targetFile))?.mtimeMs,
    version: VERSION,
    showAllFile,
    shareDir,
    writeMode,
    forceMode,
  };
  res.json(returnPayload);
};
