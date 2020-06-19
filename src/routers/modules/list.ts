import { Request, Response } from 'express-serve-static-core';
import { loadFiles } from '../../utils/file';
import { filePath, shareDir, writeMode } from '../../config';

export default async (req: Request, res: Response) => {
  const { directories, files } = await loadFiles(filePath);
  res.render('main', {
    upperDir: null,
    directories: shareDir ? directories : [],
    files,
    allowUpload: writeMode,
  });
}