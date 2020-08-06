import Express from 'express';
import fs, { promises as fsPromise } from 'fs';
import path from 'path';
import { filePath, shareDir, showAllFile } from '@/config';
import { toSafeFilePath } from '@/utils/string';
import { isUnixHiddenFilename } from '@/server/utils/file';
import handleDownload from './modules/download';
import handleList from './modules/list';
import handleStatus from './modules/status';
import handleUpload from './modules/upload';

const router = Express.Router();

// 检查文件是否存在并合法
router.use(async (req, res, next) => {
  const receivedPath = toSafeFilePath(decodeURI(req.query.path as string));
  const targetFile = path.join(filePath, receivedPath); // 目标地址
  switch (true) {
    case !shareDir && receivedPath.split('/').filter(i => i).length > 0: // 检查文件夹权限
    case !showAllFile && isUnixHiddenFilename(targetFile): // 检查隐藏文件权限
      res.status(404);
      return res.end();
    default:
  }
  try {
    await fsPromise.access(targetFile, fs.constants.R_OK);
    req.query.targetFile = targetFile;
    next();
  } catch (e) {
    res.status(404);
    res.end();
  }
});

/* 获取服务器状态 */
router.get('/status', handleStatus);
/* 获取文件列表 */
router.get('/list', handleList);
/* 文件上传 */
router.post('/upload', handleUpload);
/* 下载文件 */
router.get('/download', handleDownload);

export default router;
