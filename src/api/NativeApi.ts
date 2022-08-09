import Result from "@/global/Result";
import {AxiosRequestConfig} from "axios";
import CompressingOptions from "@/api/entities/CompressingOptions";
import FileApi from "@/api/FileApi";

const {ipcRenderer} = window.require('electron');

/**
 * 原生方法
 */
export default {

    async invokeCmd(cmd: string, currentDir: string, arg?: string): Promise<void> {
        let result = (await ipcRenderer.invoke('native:invoke:cmd', {
            command: cmd,
            arg: arg,
            currentDir: currentDir
        })) as Result<any>;
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
     * 异步命令，不会阻塞进程
     *
     * @param cmd 命令
     * @param currentDir 当前目录
     * @param arg 参数
     */
    async invokeAsync(cmd: string, currentDir: string, arg?: string): Promise<void> {
        let result = (await ipcRenderer.invoke('native:invoke:async', {
            command: cmd,
            arg: arg,
            currentDir: currentDir
        })) as Result<any>;
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
        })) as Result<any>;
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
    async openUrl(url: string, openWith?: string): Promise<void> {
        let result = (await ipcRenderer.invoke('native:openUrl', {
            url: url,
            openWith: openWith
        })) as Result<any>;
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

    async http<T>(args: AxiosRequestConfig): Promise<T> {
        let result = (await ipcRenderer.invoke('native:http', args)) as Result<any>;
        if (result.code) {
            return new Promise<T>(resolve => {
                resolve(result.data);
            });
        } else {
            return new Promise<T>((resolve, reject) => {
                reject(result.message)
            })
        }
    },

    async compressing(args: CompressingOptions): Promise<void> {
        if (!(await FileApi.exist(args.source))) {
            return Promise.reject("源文件不存在");
        }
        let result = (await ipcRenderer.invoke('native:compressing', args)) as Result<any>;
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