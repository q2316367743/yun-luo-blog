/**
 * ipc调用结果集
 */
export default interface Result<T> {

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
    data: T;

}