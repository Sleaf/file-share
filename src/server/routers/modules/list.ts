import { join } from 'path';
import { Request, Response } from 'express-serve-static-core';
import { getDirUpdateTime, loadFiles } from '@/server/utils/file';
import { filePath } from '@/config';
import { FileListData } from '@/@types/transition';
import { toSafeFilePath } from '@/utils/string';

export default async (req: Request, res: Response) => {
  const receivedPath = toSafeFilePath(decodeURI(req.query.path as string));
  const targetFile = join(filePath, receivedPath);
  const returnPayload: FileListData = {
    lastUpdate: (await getDirUpdateTime(targetFile))?.mtimeMs,
    fileList: await loadFiles(targetFile),
  };
  res.json(returnPayload);
};
