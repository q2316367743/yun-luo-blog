export default interface TagView {

    id: number;

    /**
     * 标签名称
     */
    name: string;

    /**
     * 创建时间
     */
    createTime: Date;

    /**
     * 文章数量
     */
    postCount: number;

}