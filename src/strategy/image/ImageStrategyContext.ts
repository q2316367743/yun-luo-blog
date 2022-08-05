import ImageStrategy from '@/strategy/image/ImageStrategy';
import ImageTypeEnum from "@/enumeration/ImageTypeEnum";
import LocalImageStrategyImpl from "@/strategy/image/impl/LocalImageStrategyImpl";
import {useSettingStore} from "@/store/SettingStore";
import PicGoImageStrategyImpl from "@/strategy/image/impl/PicGoImageStrategyImpl";

/**
 * 图片策略上下文
 */
class ImageStrategyContext {

    private strategyMap = new Map<number, ImageStrategy>();
    private static instance = new ImageStrategyContext();

    private constructor(){}

    public static getInstance(): ImageStrategyContext {
        return this.instance;
    }

    public register(name: number, strategy: ImageStrategy) {
        this.strategyMap.set(name, strategy);
    }

    public getStrategy(): ImageStrategy {
        let image = useSettingStore().image;
        let strategy = this.strategyMap.get(image.type);
        if (!strategy) {
            return this.strategyMap.get(ImageTypeEnum.LOCAL)!;
        }
        return strategy;
    }

}
const imageStrategyContext = ImageStrategyContext.getInstance();

// 注册策略
imageStrategyContext.register(ImageTypeEnum.LOCAL, new LocalImageStrategyImpl());
imageStrategyContext.register(ImageTypeEnum.PIC_GO, new PicGoImageStrategyImpl());

export default imageStrategyContext;