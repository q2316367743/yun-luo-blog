export default interface CompressingOptions {

    /**
     * 解压类型
     * <ul>
     *     <li>1:tar</li>
     *     <li>2:gzip</li>
     *     <li>3:tgz</li>
     *     <li>4:zip</li>
     * </ul>
     */
    type: number;

    /**
     * 压缩包路径
     */
    source: string;

    /**
     * 解压后路径
     */
    target: string;

}