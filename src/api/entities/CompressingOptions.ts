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
     * 是否压缩<br />
     * true: 压缩<br />
     * false: 解压
     */
    compressing: boolean;

    /**
     * 压缩包路径
     */
    source: string;

    /**
     * 解压后路径
     */
    target: string;

}