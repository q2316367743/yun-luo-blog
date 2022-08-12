/**
 * 批量执行命令
 */
export default interface CommandBatchOptions {

    /**
     * 批量命令
     */
    batch: Array<{

        /**
         * 执行的命令
         */
        command: string;

        /**
         * 参数
         */
        args: string;

        /**
         * 命令所在目录
         */
        dir: string;

    }>;

    /**
     * 完成后回调
     */
    callback: () => void;

}