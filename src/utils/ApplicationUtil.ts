import { createDir, BaseDirectory } from '@tauri-apps/api/fs'
import { documentDir } from '@tauri-apps/api/path';
import { useLocalStorage } from '@vueuse/core';

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
        let configPath = `${path}${basePath}/.config`;
        createDir(configPath).catch(() => {});
        // 创建配置文件

    })
}