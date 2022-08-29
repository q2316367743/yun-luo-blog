/**
 * 消息事件
 */
enum MessageEventEnum {

    /**
     * 程序启动
     */
    APP_LAUNCH = 'app:launch',

    // 文章相关

    /**
     * 文章新增
     */
    POST_ADD = "post:add",

    /**
     * 文章更新
     */
    POST_UPDATE = "post:update",

    /**
     * 文章删除
     */
    POST_DELETE = "post:delete",

    /**
     * hexo更新
     */
    CONFIG_UPDATE = 'config:update',

    // 服务器

    /**
     * 服务器启动
     */
    SERVER_START = "server:start",

    /**
     * 服务器更新开始
     */
    SERVER_UPDATE_START = "server:update:start",

    /**
     * 服务器更新完成
     */
    SERVER_UPDATE_COMPLETE = "server:update:complete",

    /**
     * 服务器停止运行
     */
    SERVER_STOP = "server:stop",

    // 终端

    /**
     * 终端页面打开
     */
    TERMINAL_OPEN = "terminal:open"

}

export default MessageEventEnum;