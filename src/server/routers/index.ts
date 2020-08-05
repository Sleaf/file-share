import Express from 'express';
import handleDownload from './modules/download';
import handleList from './modules/list';
import handleStatus from './modules/status';
import handleUpload from './modules/upload';

const router = Express.Router();

/* 获取服务器状态 */
router.get('/status', handleStatus);
/* 获取文件列表 */
router.get('/list', handleList);
/* 文件上传 */
router.post('/upload', handleUpload);
/* 下载文件 */
router.get('/download', handleDownload);

export default router;
