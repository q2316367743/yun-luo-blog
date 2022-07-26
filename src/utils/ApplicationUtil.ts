import { createDir, BaseDirectory } from '@tauri-apps/api/fs'
import { documentDir, resolve } from '@tauri-apps/api/path';
import Constant from '@/global/Constant';

/**
 * 启动应用
 * 
 */
export function launch() {
    // 获取文档目录
    documentDir().then(path => {
        // 创建基础文件夹
        createDir(Constant.BASE, {
            dir: BaseDirectory.Document
        }).catch(() => { });
        // 创建配置文件夹
        resolve(path, Constant.BASE, Constant.CONFIG).then(configPath => {
            createDir(configPath).catch(() => { });
        });
        resolve(path, Constant.BASE, Constant.POST).then(postPath => {
            createDir(postPath).catch(() => { });
        })
        resolve(path, Constant.BASE, Constant.POST_IMAGES).then(postImagePath => {
            createDir(postImagePath).catch(() => { });
        })
    })
}