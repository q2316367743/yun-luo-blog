/**
 * 策略接口
 */
import ServerStatusEnum from "@/enumeration/ServerStatusEnum";

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
     * 将文件打包到dist目录，不进行同步
     */
    build(): Promise<void>

}
