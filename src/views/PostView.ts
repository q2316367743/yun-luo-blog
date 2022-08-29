import Post from "@/entities/Post";

/**
 * hexo文档: https://hexo.io/zh-cn/docs/front-matter
 */
export default interface PostView extends Post{

    /**
     * 标签
     */
    tags: Array<string>;

    /**
     * 分类
     */
    categories: Array<string>;

    /**
     * 内容
     */
    content?: string;

}