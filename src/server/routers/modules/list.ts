import { Request, Response } from 'express-serve-static-core';
import { getFileStat, loadFiles } from '@/server/utils/file';
import { FileListData } from '@/@types/transition';

export default async (req: Request, res: Response) => {
  const targetFile = req.query.targetFile as string;
  const returnPayload: FileListData = {
    lastUpdate: (await getFileStat(targetFile))?.mtimeMs,
    fileList: await loadFiles(targetFile),
  };
  res.json(returnPayload);
};
