export default interface SshConfig {

    /**
     * 主机
     */
    host: string;

    /**
     * 端口
     */
    port: number;

    /**
     * 用户名
     */
    username: string;

    /**
     * 密码
     */
    password: string;

    /**
     * 本地路径
     */
    localDir?: string;

    /**
     * 远程文件夹
     */
    remoteDir?: string;

}
