/**
 * 策略接口
 */
export default interface Strategy {

    /**
     * 同步
     */
    sync(): Promise<void>;

}
