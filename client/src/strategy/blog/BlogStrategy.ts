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
     * 仅构建构建
     */
    dist(): Promise<void>;

    /**
     * 将文件打包到dist目录，不进行同步
     *
     * @param callback 完成构建后回调
     */
    build(callback: () => void): Promise<void>;

}
