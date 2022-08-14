/**
 * 策略上下文
 */
import BlogStrategy from "@/strategy/blog/BlogStrategy";
import BlogTypeEnum from "@/enumeration/BlogTypeEnum";
import HexoStrategyImpl from "@/strategy/blog/impl/HexoStrategyImpl";
import {settingService} from "@/global/BeanFactory";

class BlogStrategyContext {

    private strategyMap = new Map<String, BlogStrategy>();
    private static instance = new BlogStrategyContext();

    private constructor(){}

    public static getInstance(): BlogStrategyContext {
        return this.instance;
    }

    public register(name: string, strategy: BlogStrategy) {
        this.strategyMap.set(name, strategy);
    }

    public getStrategy(): BlogStrategy {
        let basicSetting = settingService.getBasic();
        let strategy = this.strategyMap.get(basicSetting.blogType);
        if (!strategy) {
            return this.strategyMap.get(BlogTypeEnum.HEXO)!;
        }
        return strategy;
    }

}
const blogStrategyContext = BlogStrategyContext.getInstance();

// 注册策略
blogStrategyContext.register(BlogTypeEnum.HEXO, new HexoStrategyImpl());

export default blogStrategyContext;