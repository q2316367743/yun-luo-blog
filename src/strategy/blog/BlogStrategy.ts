/**
 * 策略接口
 */
export default interface BlogStrategy {

    /**
     * 是否初始化
     */
    isInit(): Promise<boolean>;

    /**
     * 同步
     */
    sync(): Promise<void>;

    /**
     * 服务状态
     */
    serverStatus(): Promise<boolean>;

    /**
     * 服务开始
     */
    serverStart(): Promise<void>;

    /**
     * 服务停止
     */
    serverStop(): Promise<void>;

}
