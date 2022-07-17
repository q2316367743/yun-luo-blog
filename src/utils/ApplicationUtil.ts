import { createDir, BaseDirectory } from '@tauri-apps/api/fs'
import { documentDir, resolve } from '@tauri-apps/api/path';

/**
 * 启动应用
 * 
 */
export function launch() {
    // 获取文档目录
    documentDir().then(path => {
        let basePath = `cloud-fell-blog`;
        // 创建基础文件夹
        createDir(basePath, {
            dir: BaseDirectory.Document
        }).catch(() => { });
        // 创建配置文件夹
        resolve(path, basePath, '.config').then(configPath => {
            createDir(configPath).catch(() => {});
        });
        resolve(path, basePath, 'posts').then(postPath => {
            createDir(postPath).catch(() => {});
        })
    })
}