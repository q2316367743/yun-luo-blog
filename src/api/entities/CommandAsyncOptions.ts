/**
 * 异步命令执行参数
 */
export default interface CommandAsyncOptions {

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
     * 完成回调
     */
    error: (e: Error) => void;

    success: () => void;

    warning: (message: string) => void;

}