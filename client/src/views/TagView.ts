import Tag from "@/entities/Tag";

export default interface TagView extends Tag{

    /**
     * 文章数量
     */
    postCount: number;

    /**
     * 页面数量
     */
    pageCount: number;

}