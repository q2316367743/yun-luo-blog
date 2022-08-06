/**
 * 图片策略接口
 */
export default interface ImageStrategy {

    /**
     * 上传图片
     *
     * @return 上传完后的图片地址
     */
    upload(): Promise<string>;

    /**
     * 解析图片URL
     *
     * @param url 图片的URL
     * @return 解析后的URL
     */
    parse(url: string): string;

}
