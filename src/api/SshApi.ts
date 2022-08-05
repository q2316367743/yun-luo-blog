import SshConfig from "@/api/entities/SshConfig";
import Result from "@/global/Result";

const {ipcRenderer} = window.require('electron');

export default {

    /**
     * 使用SFTP将文件推送到远程
     *
     * @param config ssh配置
     */
    async sftp(config: SshConfig): Promise<void> {
        let result = (await ipcRenderer.invoke('ssh:sftp', config)) as Result<any>;
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
