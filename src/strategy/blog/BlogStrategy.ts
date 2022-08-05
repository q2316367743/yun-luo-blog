/**
 * 策略接口
 */
export default interface BlogStrategy {

    /**
     * 同步
     */
    sync(): Promise<void>;

    /**
     * 初始化
     */
    init(): Promise<void>;

    /**
     * 清理缓存
     */
    clean(): Promise<void>;

    /**
     * 运行预览
     */
    server(): Promise<void>;

    /**
     * 部署、打包
     */
    deploy(): Promise<void>;

}
