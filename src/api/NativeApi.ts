import Result from "@/global/Result";
import {AxiosRequestConfig} from "axios";
import CompressingOptions from "@/api/entities/CompressingOptions";
import FileApi from "@/api/FileApi";
import CommandAsyncOptions from "@/api/entities/CommandAsyncOptions";

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
     * @param options 命令参数
     */
    async invokeAsync(options: CommandAsyncOptions): Promise<void> {
        let result = (await ipcRenderer.invoke('native:invoke:async', {
            id: options.id,
            command: options.command,
            arg: options.args,
            currentDir: options.currentDir
        })) as Result<any>;
        // 监听
        ipcRenderer.on(`native:invoke:async:stdout:${options.id}`, (event: any, args: Uint8Array) => {
            options.out(event, args);
        });
        ipcRenderer.on(`native:invoke:async:stderr:${options.id}`, (event: any, args: Uint8Array) => {
            options.err(event, args);
        });
        ipcRenderer.on(`native:invoke:async:exit:${options.id}`, (event: any, args: Uint8Array) => {
            options.exit(event, args);
        });
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

    async kill(id: number): Promise<void> {
        console.log(`native:invoke:async:kill:${id}`)
        ipcRenderer.send(`native:invoke:async:kill:${id}`);
        return Promise.resolve();
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