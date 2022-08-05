/**
 * 策略上下文
 */
import Strategy from "@/strategy/blog/Strategy";
import BlogTypeEnum from "@/enumeration/BlogTypeEnum";
import HexoStrategyImpl from "@/strategy/blog/impl/HexoStrategyImpl";

class StrategyContext {

    private strategyMap = new Map<String, Strategy>();
    private static instance = new StrategyContext();

    private constructor(){}

    public static getInstance(): StrategyContext {
        return this.instance;
    }

    public register(name: string, strategy: Strategy) {
        this.strategyMap.set(name, strategy);
    }

    public getStrategy(name: string): Strategy {
        let strategy = this.strategyMap.get(name);
        if (!strategy) {
            return this.strategyMap.get(BlogTypeEnum.HEXO)!;
        }
        return strategy;
    }

}
const strategyContext = StrategyContext.getInstance();

// 注册策略
strategyContext.register(BlogTypeEnum.HEXO, new HexoStrategyImpl());

export default strategyContext;