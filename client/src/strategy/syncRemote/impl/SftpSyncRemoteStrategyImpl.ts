import SyncRemoteStrategy from "@/strategy/syncRemote/SyncRemoteStrategy";
import {settingService} from "@/global/BeanFactory";
import SftpApi from "@/api/SftpApi";

export default class SftpSyncRemoteStrategyImpl implements SyncRemoteStrategy {

    async push(): Promise<void> {
        let sftpSetting = settingService.getSyncRemote().sftp;
        await SftpApi.upload(sftpSetting)
        return Promise.resolve();
    }

}
