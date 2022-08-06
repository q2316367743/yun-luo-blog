import ImageStrategy from '@/strategy/image/ImageStrategy';
import ImageTypeEnum from "@/enumeration/ImageTypeEnum";
import LocalImageStrategyImpl from "@/strategy/image/impl/LocalImageStrategyImpl";
import {useSettingStore} from "@/store/SettingStore";
import PicGoImageStrategyImpl from "@/strategy/image/impl/PicGoImageStrategyImpl";
import QiNiuImageStrategyImpl from "@/strategy/image/impl/QiNiuImageStrategyImpl";

/**
 * 图片策略上下文
 */
class ImageStrategyContext {

    private strategyMap = new Map<number, ImageStrategy>();
    private static instance = new ImageStrategyContext();

    private constructor() {
    }

    public static getInstance(): ImageStrategyContext {
        return this.instance;
    }

    public register(name: number, strategy: ImageStrategy) {
        this.strategyMap.set(name, strategy);
    }

    public getStrategy(name?: number): ImageStrategy {
        let strategy;
        if (name) {
            strategy = this.strategyMap.get(name);
        } else {
            let image = useSettingStore().image;
            strategy = this.strategyMap.get(image.type);
        }
        if (!strategy) {
            return this.strategyMap.get(ImageTypeEnum.LOCAL)!;
        }
        return strategy;
    }

}

const imageStrategyContext = ImageStrategyContext.getInstance();

// 注册策略
imageStrategyContext.register(ImageTypeEnum.LOCAL, new LocalImageStrategyImpl());
imageStrategyContext.register(ImageTypeEnum.QI_NIU, new QiNiuImageStrategyImpl());
imageStrategyContext.register(ImageTypeEnum.PIC_GO, new PicGoImageStrategyImpl());

export default imageStrategyContext;