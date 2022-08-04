import Result from "@/global/Result";

const {ipcRenderer} = window.require('electron');

/**
 * 原生方法
 */
export default {

    async invokeCmd(cmd: string, currentDir: string, arg?: any): Promise<void> {
        let result = (await ipcRenderer.invoke('native:invoke', {
            command: cmd,
            arg: arg,
            currentDir: currentDir
        })) as Result;
        if (result.code) {
            return new Promise<void>(resolve => {
                resolve(result.data);
            });
        } else {
            return new Promise<void>((resolve, reject) => {
                reject(result.message)
            })
        }
    },

    /**
     * 打开一个文件夹
     * @param path
     */
    async openFolder(path: string): Promise<void> {
        let result = (await ipcRenderer.invoke('native:openFolder', {
            path: path
        })) as Result;
        if (result.code) {
            return new Promise<void>(resolve => {
                resolve(result.data);
            });
        } else {
            return new Promise<void>((resolve, reject) => {
                reject(result.message)
            })
        }
    },

    /**
     * 打开一个网址
     *
     * @param url 网址
     * @param openWith 通过那个浏览器
     */
    async openUrl(url: string, openWith?: string) {
        let result = (await ipcRenderer.invoke('native:openUrl', {
            url: url,
            openWith: openWith
        })) as Result;
        if (result.code) {
            return new Promise<void>(resolve => {
                resolve(result.data);
            });
        } else {
            return new Promise<void>((resolve, reject) => {
                reject(result.message)
            })
        }
    }

}