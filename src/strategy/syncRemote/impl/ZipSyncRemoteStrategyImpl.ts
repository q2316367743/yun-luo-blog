import SyncRemoteStrategy from "@/strategy/syncRemote/SyncRemoteStrategy";
import Constant from "@/global/Constant";
import NativeApi from "@/api/NativeApi";
import FileApi from "@/api/FileApi";
import {settingService} from "@/global/BeanFactory";

export default class ZipSyncRemoteStrategyImpl implements SyncRemoteStrategy {

    async push(): Promise<void> {
        let sourceDir = await Constant.FOLDER.DIST();
        let targetPath = await FileApi.resolve(settingService.getSyncRemote().zip.dir, new Date().getTime() + '.zip');
        return NativeApi.compressing({
            type: 1,
            compressing: true,
            source: sourceDir,
            target: targetPath
        })
    }

}