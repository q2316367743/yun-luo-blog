import PostListView from "@/views/PostListView";

/**
 * 文章视图对象，真正存储到数据库的
 */
export default interface PostInfoView extends PostListView {


    content: string;

}