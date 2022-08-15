/**
 * 同步 - 远程 - sftp设置
 */
export default interface SyncRemoteSftpSetting {

    /**
     * 服务器设置
     */
    server: string;

    /**
     * 端口
     */
    port: number;

    /**
     * 用户名
     */
    username: string;

    /**
     * 连接类型
     */
    connectType:number;

    /**
     * 密码
     */
    password: string;

    /**
     * ssh私钥
     */
    privateKey: string;

    /**
     * 远程地址
     */
    remotePath: string;

}