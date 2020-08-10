import path from 'path';
import fs, { promises as fsPromise } from 'fs';
import { shareDir, showAllFile } from '@/config';
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
  const res = fileStats.map<FileItem>(file => ({
    name: file.fileInfo.name,
    isDirectory: file.stat.isDirectory(),
    isFile: file.stat.isFile(),
    size: file.stat.size,
    lastModify: file.stat.mtime.getTime(),
  }));
  return shareDir ? res : res.filter(i => i.isFile);
};

/*
 * 获取文件夹更新时间
 * undefined 说明暂无缓存
 * null 说明该地址无效
 * [value] 即为该地址的stat
 * */
const CACHE_EXPIRE = 2_000; // 最长缓存
const fileStatCache: Record<string, Nullable<[Nullable<fs.Stats>, number]>> = {}; // [stat,time]
export const getFileStat = async (filePath: string): Promise<Nullable<fs.Stats>> => {
  const cachedStat = fileStatCache[filePath];
  if (cachedStat != null) {
    if (cachedStat[1] + CACHE_EXPIRE < Date.now()) {
      // 缓存已过期
      fileStatCache[filePath] = [undefined, cachedStat[1]];
    } else {
      // 含有有效缓存
      return cachedStat?.[0];
    }
  }
  if (cachedStat?.[0] === undefined) {
    try {
      fileStatCache[filePath] = null; // 占位防止多次触发
      const curFileStat = await fsPromise.stat(filePath);
      if (!shareDir && curFileStat.isDirectory()) {
        return null;
      }
      fileStatCache[filePath] = [curFileStat, Date.now()];
      return curFileStat;
    } catch (e) {
      fileStatCache[filePath] = undefined;
      errMsg('获取文件状态失败：', filePath);
      return null;
    }
  }
  // is null
  return null;
};
