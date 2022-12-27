export default interface PostTag {

    /**
     * ID，自动生成
     */
    id?: number;

    /**
     * 文章ID
     */
    postId: number;

    /**
     * 标签ID
     */
    tagId: number;

}