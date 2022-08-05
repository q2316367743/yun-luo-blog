import {useSettingStore} from "@/store/SettingStore";
import PlatformStrategy from "@/strategy/platform/PlatformStrategy";
import PlatformTypeEnum from "@/enumeration/PlatformTypeEnum";
import SftpPlatformStrategyImpl from "@/strategy/platform/impl/SftpPlatformStrategyImpl";
import DefaultPlatformStrategyImpl from "@/strategy/platform/impl/DefaultPlatformStrategyImpl";

/**
 * 图片策略上下文
 */
class PlatformStrategyContext {

    private strategyMap = new Map<string, PlatformStrategy>();
    private static instance = new PlatformStrategyContext();

    private constructor(){}

    public static getInstance(): PlatformStrategyContext {
        return this.instance;
    }

    public register(name: string, strategy: PlatformStrategy) {
        this.strategyMap.set(name, strategy);
    }

    public getStrategy(): PlatformStrategy {
        let sync = useSettingStore().sync;
        let strategy = this.strategyMap.get(sync.platform);
        if (!strategy) {
            return this.strategyMap.get(PlatformTypeEnum.DEFAULT)!;
        }
        return strategy;
    }

}
const platformStrategyContext = PlatformStrategyContext.getInstance();

// 注册策略
platformStrategyContext.register(PlatformTypeEnum.DEFAULT, new DefaultPlatformStrategyImpl());
platformStrategyContext.register(PlatformTypeEnum.SFTP, new SftpPlatformStrategyImpl());

export default platformStrategyContext;