import Post from "@/entities/Post";
import PostListView from "@/views/PostListView";
import PostInfoView from "@/views/PostInfoView";

export default {

    /**
     * 查询文章列表
     * @param condition 查询条件
     */
    async list(condition?: Partial<Post>): Promise<Array<PostListView>> {
        return Promise.resolve([]);
    },

    /**
     * 根据ID查询文章详情

     * @param id 文章ID
     */
    async info(id: number): Promise<PostInfoView | void> {},

    /**
     * 根据ID删除一个文章
     *
     * @param id 文章ID
     */
    async deleteById(id: number): Promise<void> {
        return Promise.resolve();
    },

    /**
     * 根据ID更新一个文章
     * @param post 文章详情
     */
    async update(post: PostInfoView): Promise<void> {

    },

    /**
     * 新增一个文章
     *
     * @param post 文章详情
     */
    async insert(post: PostInfoView): Promise<void> {

    }
}