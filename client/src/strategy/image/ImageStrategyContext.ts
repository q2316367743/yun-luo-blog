import ImageStrategy from '@/strategy/image/ImageStrategy';
import ImageTypeEnum from "@/enumeration/ImageTypeEnum";
import LocalImageStrategyImpl from "@/strategy/image/impl/LocalImageStrategyImpl";
import PicGoImageStrategyImpl from "@/strategy/image/impl/PicGoImageStrategyImpl";
import QiNiuImageStrategyImpl from "@/strategy/image/impl/QiNiuImageStrategyImpl";
import {settingService} from "@/global/BeanFactory";

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

    public async init(): Promise<void> {
        for (let item of this.strategyMap.values()) {
            await item.init();
        }
    }

    public register(name: number, strategy: ImageStrategy) {
        this.strategyMap.set(name, strategy);
    }

    public getStrategy(name?: number): ImageStrategy {
        let strategy;
        if (name) {
            strategy = this.strategyMap.get(name);
        } else {
            let image = settingService.getImage();
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