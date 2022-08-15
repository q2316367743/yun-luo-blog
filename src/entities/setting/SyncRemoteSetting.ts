import SyncRemoteSftpSetting from "@/entities/setting/SyncRemoteSftpSetting";

/**
 * 同步 - 远程
 */
export default interface SyncRemoteSetting {

    /**
     * 类型
     */
    type: number;

    /**
     * sftp设置
     */
    sftp: SyncRemoteSftpSetting;

}