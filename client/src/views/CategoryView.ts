import Category from "@/entities/Category";

export default interface CategoryView extends Category{

    /**
     * 子类
     */
    children: Array<CategoryView>;

    /**
     * 文章数量
     */
    postCount: number;

    /**
     * 页面数量
     */
    pageCount: number;

}