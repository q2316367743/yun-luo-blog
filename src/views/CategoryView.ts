export default interface CategoryView {

    /**
     * id
     */
    id: number;

    /**
     * 名称
     */
    name: string;

    /**
     * 文章ID
     */
    postId: number;

    /**
     * 创建时间
     */
    createTime: Date;

    /**
     * 更新时间
     */
    updateTime: Date;

    /**
     * 子类
     */
    children: Array<CategoryView>;

}