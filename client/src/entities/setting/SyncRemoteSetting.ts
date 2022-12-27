import SyncRemoteSftpSetting from "@/entities/setting/SyncRemoteSftpSetting";
import SyncRemoteZipSetting from "@/entities/setting/SyncRemoteZipSetting";

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

    /**
     * 导出为ZIP压缩包
     */
    zip: SyncRemoteZipSetting;

}