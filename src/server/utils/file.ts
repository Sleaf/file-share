import path from 'path';
import fs, { promises as fsPromise } from 'fs';
import { showAllFile } from '@/config';
import { FileItem } from '@/@types/transition';
import { errMsg } from '@/server/utils/log';

export const isUnixHiddenFilename = (fileName: string) => /(^|\/)\.[^/.]/g.test(fileName);

/*
 * 读取文件列表
 * */
export const loadFiles = async (dirPath: string) => {
  const results = await fsPromise.readdir(dirPath, { withFileTypes: true });
  const fileDirents = showAllFile ? results : results.filter(file => !isUnixHiddenFilename(file.name));
  let fileStats: Array<{ stat: fs.Stats; fileInfo: fs.Dirent }> = [];
  try {
    fileStats = await Promise.all(
      fileDirents.map(fileInfo =>
        fsPromise.stat(path.resolve(dirPath, fileInfo.name)).then(stat => ({ stat, fileInfo })),
      ),
    );
  } catch (e) {
    console.error(e);
  }
  return fileStats.map<FileItem>(file => ({
    type: file.stat.isDirectory() ? 'dir' : 'file',
    name: file.fileInfo.name,
    isDirectory: file.stat.isDirectory(),
    isFile: file.stat.isFile(),
    size: file.stat.size,
    lastModify: file.stat.mtime.getTime(),
  }));
};

/*
 * 获取文件夹更新时间
 * */
const dirUpdateCache: Record<string, Nullable<fs.Stats>> = {};
export const getDirUpdateTime = async (filePath: string) => {
  if (dirUpdateCache[filePath] !== undefined) {
    return dirUpdateCache[filePath];
  }
  if (dirUpdateCache[filePath] !== null) {
    // null 说明有程序在进行
    try {
      dirUpdateCache[filePath] = null; // 占位防止多次触发
      dirUpdateCache[filePath] = await fsPromise.stat(filePath);
      console.debug('开始监控目录变化：', filePath);
      fs.watchFile(filePath, stat => {
        dirUpdateCache[filePath] = stat;
        console.debug('目录已更新：', filePath);
      });
      return dirUpdateCache[filePath];
    } catch (e) {
      dirUpdateCache[filePath] = undefined;
      errMsg('获取文件夹更新时间失败：', filePath);
      return null;
    }
  }
  return null;
};
