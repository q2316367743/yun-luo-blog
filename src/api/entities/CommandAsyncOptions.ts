import CommandSyncOptions from "@/api/entities/CommandSyncOptions";

/**
 * 异步命令执行参数
 */
export default interface CommandAsyncOptions extends CommandSyncOptions{


    /**
     * 完成回调
     */
    error: (e: Error) => void;

    success: () => void;

    warning: (message: string) => void;

}