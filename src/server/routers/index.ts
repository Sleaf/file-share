import Express from 'express';
import handleDownload from './modules/download';
import handleUpload from './modules/upload';

const router = Express.Router();

/* 文件上传 */
router.post('/upload/*', handleUpload);
/* 下载文件 */
router.get('*', handleDownload);

export default router;
