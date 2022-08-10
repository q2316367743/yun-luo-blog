/**
 * 异步命令执行参数
 */
export default interface CommandAsyncOptions {

    /**
     * 指定的ID
     */
    id: number;

    /**
     * 命令
     */
    command: string;

    /**
     * 参数
     */
    args: string;

    /**
     * 云销目录
     */
    currentDir: string;

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