import { createDir, BaseDirectory } from '@tauri-apps/api/fs'
import { documentDir, resolve } from '@tauri-apps/api/path';
import constant from '@/global/constant';

/**
 * 启动应用
 * 
 */
export function launch() {
    // 获取文档目录
    documentDir().then(path => {
        // 创建基础文件夹
        createDir(constant.BASE, {
            dir: BaseDirectory.Document
        }).catch(() => { });
        // 创建配置文件夹
        resolve(path, constant.BASE, constant.CONFIG).then(configPath => {
            createDir(configPath).catch(() => { });
        });
        resolve(path, constant.BASE, constant.POST).then(postPath => {
            createDir(postPath).catch(() => { });
        })
        resolve(path, constant.BASE, constant.POST_IMAGES).then(postImagePath => {
            createDir(postImagePath).catch(() => { });
        })
    })
}