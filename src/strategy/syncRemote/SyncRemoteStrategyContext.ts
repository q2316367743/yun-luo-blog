import SyncRemoteStrategy from "@/strategy/syncRemote/SyncRemoteStrategy";
import PlatformTypeEnum from "@/enumeration/PlatformTypeEnum";
import SftpSyncRemoteStrategyImpl from "@/strategy/syncRemote/impl/SftpSyncRemoteStrategyImpl";
import DefaultSyncRemoteStrategyImpl from "@/strategy/syncRemote/impl/DefaultSyncRemoteStrategyImpl";
import {settingService} from "@/global/BeanFactory";
import ZipSyncRemoteStrategyImpl from "@/strategy/syncRemote/impl/ZipSyncRemoteStrategyImpl";

/**
 * 图片策略上下文
 */
class SyncRemoteStrategyContext {

    private strategyMap = new Map<number, SyncRemoteStrategy>();
    private static instance = new SyncRemoteStrategyContext();

    private constructor() {
    }

    public static getInstance(): SyncRemoteStrategyContext {
        return this.instance;
    }

    public register(name: number, strategy: SyncRemoteStrategy) {
        this.strategyMap.set(name, strategy);
    }

    public getStrategy(): SyncRemoteStrategy {
        let sync = settingService.getSyncRemote();
        let strategy = this.strategyMap.get(sync.type);
        if (!strategy) {
            return this.strategyMap.get(PlatformTypeEnum.DEFAULT)!;
        }
        return strategy;
    }

}

const syncRemoteStrategyContext = SyncRemoteStrategyContext.getInstance();

// 注册策略
syncRemoteStrategyContext.register(PlatformTypeEnum.DEFAULT, new DefaultSyncRemoteStrategyImpl());
syncRemoteStrategyContext.register(PlatformTypeEnum.SFTP, new SftpSyncRemoteStrategyImpl());
syncRemoteStrategyContext.register(PlatformTypeEnum.ZIP, new ZipSyncRemoteStrategyImpl());

export default syncRemoteStrategyContext;