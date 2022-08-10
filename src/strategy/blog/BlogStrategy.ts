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

}
