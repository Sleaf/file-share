import Express from 'express';
import path from 'path';
import fs, { promises as fsPromise } from 'fs';
import { getCommonLogString } from '@/server/utils/log';
import { forceMode, writeMode } from '@/config';
import { toAutoUnit, toSignificantDigits } from '@/utils/number';

export default async (req: Express.Request, res: Express.Response) => {
  const targetFile = req.query.targetFile as string;
  if (!req.files) {
    res.statusCode = 400;
    return res.end();
  }
  if (!writeMode) {
    res.statusCode = 403;
    return res.end();
  }
  // 检查是否可写
  try {
    await fsPromise.access(targetFile, fs.constants.W_OK);
  } catch (e) {
    console.error(getCommonLogString(req.ip), `上传失败：【${targetFile}】`, e.message);
    res.statusCode = 403;
    return res.end();
  }
  const uploadList = Array.isArray(req.files.fileList) ? req.files.fileList : [req.files.fileList];
  // 处理所有文件
  for (const file of uploadList) {
    const fileDist = path.join(targetFile, file.name);
    // 检查文件状态
    try {
      const fileState = await fsPromise.stat(fileDist);
      if (fileState.isFile() && !forceMode) {
        // 文件存在且未开放写入
        console.error(
          getCommonLogString(req.ip),
          `上传文件失败:【${fileDist}】，文件已存在，且非强制写入模式（-wf）。`,
        );
        res.statusCode = 403;
        return res.end();
      }
    } catch (e) {
      file.mv(fileDist);
      console.log(getCommonLogString(req.ip), `上传文件: ${fileDist} (${toAutoUnit(file.size, toSignificantDigits)}B)`);
    }
  }

  // success
  res.statusCode = 201;
  return res.end();
};
