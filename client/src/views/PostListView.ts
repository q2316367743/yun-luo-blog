import Post from "@/entities/Post";
import Entry from "@/global/Entry";

/**
 * 文章视图对象，真正存储到数据库的
 */
export default interface PostListView extends Post{

    /**
     * 类型，posts/pages<br />
     * 在读取的时候直接赋值
     */
    type: string;

    /**
     * 标签
     */
    tags: Array<string>;

    /**
     * 分类
     */
    categories: Array<string>;

    /**
     * 额外的
     */
    extra: Array<Entry>;

    /**
     * 拓展属性
     */
    expand: string;

}