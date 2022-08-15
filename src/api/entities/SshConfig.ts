import SyncRemoteSftpSetting from "@/entities/setting/SyncRemoteSftpSetting";

export default interface SshConfig extends SyncRemoteSftpSetting{

    /**
     * 本地路径
     */
    localDir?: string;

}
