/**
 * 文章分类，每隔文章只会属于一个分类
 */
export default interface PostCategory {

    /**
     * ID
     */
    id?: number;

    /**
     * 文章ID，唯一
     */
    postId: number;

    /**
     * 分类ID，唯一
     */
    categoryId: number;

    /**
     * 创建时间
     */
    createTime: Date;

}