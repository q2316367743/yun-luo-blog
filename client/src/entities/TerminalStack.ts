/**
 * 命令栈
 */
export default interface TerminalStack {

    /**
     * ID，唯一
     */
    id: number;

    /**
     * 名字
     */
    name: string;

    /**
     * 是否运行中
     */
    run: boolean;

    /**
     * 是否执行成功
     */
    success: boolean;

    /**
     * 创建时间
     */
    time: Date,

    /**
     * 是否展示
     */
    show: boolean;

    /**
     * 命令
     */
    command: string;

    /**
     * 内容
     */
    contents: Array<string>;

}