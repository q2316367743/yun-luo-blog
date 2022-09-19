/**
 * 提示设置
 */
export default interface HintSetting {

    /**
     * 本地图片未使用图床提示
     */
    localImage: boolean;

    /**
     * 更新服务器 - 开始
     */
    updateServerStart: boolean;

    /**
     * 更新服务器 - 完成
     */
    updateServerComplete: boolean;

    /**
     * 更新服务器 - 异常
     */
    updateServerError: boolean;

}