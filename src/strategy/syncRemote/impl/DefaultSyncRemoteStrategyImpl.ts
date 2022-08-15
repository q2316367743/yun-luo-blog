import SyncRemoteStrategy from "@/strategy/syncRemote/SyncRemoteStrategy";
import {ElMessage} from "element-plus";

/**
 * 默认策略
 */
export default class DefaultSyncRemoteStrategyImpl implements SyncRemoteStrategy {

    push(): Promise<void> {
        ElMessage({
            showClose: true,
            type: 'warning',
            message: '未配置同步平台'
        })
        return Promise.resolve();
    }

}
