export default interface ServerSetting {

    /**
     * 服务器端口
     */
    port: number;

    /**
     * 更新时是否同步服务器
     */
    updateBySync: boolean;

    /**
     * 同步成功是否发送通知
     */
    noticeBySyncWithSuccess: boolean;

    /**
     * 同步失败是否发送通知
     */
    noticeBySyncWithError: boolean

}