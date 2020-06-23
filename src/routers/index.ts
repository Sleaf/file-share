import Express from 'express';
import handleList from './modules/list';
import handleDownload from './modules/download';
import handleUpload from './modules/upload';

const router = Express.Router();

/* 文件上传 */
router.post('/upload/*', handleUpload);
/* 获取文件列表 */
router.get('/', handleList);
/* 下载文件 */
router.get('*', handleDownload);

export default router;
