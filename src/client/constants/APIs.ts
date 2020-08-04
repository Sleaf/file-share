/**
 * 此文件保存项目中使用的所有API的URL
 * 动态部分使用:开头，如 /user/:id/dashboard id部分使用 fillURL 等工具填充为自定义值
 * 如有返回值必须声明返回值类型，本页即API文档
 * */
/* Utils */
import { GET } from '@/utils/request';

export const FETCH_FILE_LIST = () =>
  GET<{
    lastUpdate: Timestamp;
    fileList: Array<FileItem>;
  }>`/api/list`({ path: window.location.pathname });
export const GET_SERVER_STATUS = () => GET<ServerStatus>`/api/status`();
