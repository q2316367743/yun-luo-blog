/**
 * 图片 - 七牛云设置
 */
export default interface ImageQiNiuSetting {

    /**
     * 访问key
     */
    accessKey: string;

    /**
     * 密钥
     */
    secretKey: string;

    /**
     * 存储空间名
     */
    storageSpace: string;

    /**
     * 访问网址
     */
    accessUrl: string;

    /**
     * 存储区域
     */
    storageArea: string;

    /**
     * 网址后缀
     */
    urlSuffix: string;

    /**
     * 指定存储目录
     */
    storagePath: string;

}