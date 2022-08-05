/**
 * 平台策略接口
 */
export default interface PlatformStrategy {

    /**
     * 将内容推送到平台
     */
    push(): Promise<void>;

}
