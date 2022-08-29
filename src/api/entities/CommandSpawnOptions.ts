import CommandSyncOptions from "@/api/entities/CommandSyncOptions";

/**
 * 异步命令执行参数
 */
export default interface CommandSpawnOptions extends CommandSyncOptions{

    /**
     * ID
     */
    id: number;

    /**
     * 输出流
     * @param event 事件
     * @param data 数据
     */
    out: (event: any, data: Uint8Array) => void;

    /**
     * 错误流
     * @param event 事件
     * @param data 数据
     */
    err: (event: any, data: Uint8Array) => void;

    /**
     * 退出
     * @param event 事件
     * @param data 数据
     */
    exit: (event: any, data: Uint8Array) => void;

}