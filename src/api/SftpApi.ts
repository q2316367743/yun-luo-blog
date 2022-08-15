import Result from "@/global/Result";
import SshConfig from "@/api/entities/SshConfig";
import Constant from "@/global/Constant";

const {ipcRenderer} = window.require('electron');

export default {

    /**
     * 使用SFTP将文件推送到远程
     *
     * @param config ssh配置
     */
    async test(config: SshConfig): Promise<boolean> {
        let result = (await ipcRenderer.invoke('sftp:test', JSON.parse(JSON.stringify(config)))) as Result<boolean>;
        if (result.code) {
            return new Promise<boolean>(resolve => {
                resolve(result.data);
            });
        } else {
            return new Promise<boolean>((resolve, reject) => {
                reject(result.message)
            })
        }
    },

    /**
     * 使用SFTP将文件推送到远程
     *
     * @param config ssh配置
     */
    async upload(config: SshConfig): Promise<void> {
        config.localDir = await Constant.FOLDER.DIST();
        let result = (await ipcRenderer.invoke('sftp:upload', config)) as Result<any>;
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
