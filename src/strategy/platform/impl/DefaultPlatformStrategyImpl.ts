import PlatformStrategy from "@/strategy/platform/PlatformStrategy";
import {ElMessage} from "element-plus";

/**
 * 默认策略
 */
export default class DefaultPlatformStrategyImpl implements PlatformStrategy {

    push(): Promise<void> {
        ElMessage({
            showClose: true,
            type: 'warning',
            message: '未配置同步平台'
        })
        return Promise.resolve();
    }

}
