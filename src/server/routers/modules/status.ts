import { Request, Response } from 'express-serve-static-core';
import { ServerStatus } from '@/@types/transition';
import { forceMode, shareDir, showAllFile, VERSION, writeMode } from '@/config';
import { getFileStat } from '@/server/utils/file';

export default async (req: Request, res: Response) => {
  const targetFile = req.query.targetFile as string;
  const returnPayload: ServerStatus = {
    fileListUpdateTIme: (await getFileStat(targetFile))?.mtimeMs,
    version: VERSION,
    showAllFile,
    shareDir,
    writeMode,
    forceMode,
  };
  res.json(returnPayload);
};
