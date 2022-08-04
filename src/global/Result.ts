/**
 * ipc调用结果集
 */
export default interface Result {

    /**
     * 状态
     */
    code: boolean;

    /**
     * 消息
     */
    message: string;

    /**
     * 内容
     */
    data: any;

}