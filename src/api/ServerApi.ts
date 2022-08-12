import Result from "@/global/Result";

const {ipcRenderer} = window.require('electron');

export default {

    /**
     * 开始一个服务器
     * @param path 服务器地址
     * @param port 服务器端口
     */
    async start(path: string, port: number): Promise<void> {
        let result = (await ipcRenderer.invoke('server:start', {
            serverDir: path,
            port
        })) as Result<void>;
        if (result.code) {
            return new Promise<void>(resolve => {
                resolve(result.data);
            });
        } else {
            return new Promise<void>((resolve1, reject) => {
                reject(result.message)
            })
        }
    },

    /**
     * 停止这个服务器
     * @param callback 错误回调
     */
    async stop(callback: (error: Error) => void): Promise<void> {
        let result = (await ipcRenderer.invoke('server:stop', {})) as Result<void>;
        ipcRenderer.on('server:error', (event: any, args: Error) => {
            callback(args);
        });
        if (result.code) {
            return new Promise<void>(resolve => {
                resolve(result.data);
            });
        } else {
            return new Promise<void>((resolve1, reject) => {
                reject(result.message)
            })
        }
    }

}