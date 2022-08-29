import Category from "@/entities/Category";
import CategoryView from "@/views/CategoryView";
import PostCategory from "@/entities/PostCategory";
import ArrayUtil from "@/utils/ArrayUtil";
import Database from "@/plugins/Database";

/**
 * 将列表转为树形
 * @param list 列表
 * @param categoryPostCountMap 文章分类映射
 * @param categoryPageCountMap 页面分类映射
 */
function tree(list: Array<Category>, categoryPostCountMap: Map<any, number>, categoryPageCountMap: Map<any, number>): Array<CategoryView> {
    let views = new Array<CategoryView>();
    for (let category of list) {
        if (category.parentId === 0) {
            views.push(getChildren({
                id: category.id!,
                name: category.name,
                parentId: category.parentId,
                createTime: category.createTime,
                updateTime: category.updateTime,
                children: [],
                postCount: categoryPostCountMap.has(category.id) ? categoryPostCountMap.get(category.id)! : 0,
                pageCount: categoryPageCountMap.has(category.id) ? categoryPageCountMap.get(category.id)! : 0
            }, list, categoryPostCountMap, categoryPageCountMap));
        }
    }
    return views;
}

function getChildren(categoryView: CategoryView, list: Array<Category>, categoryPostCountMap: Map<any, number>, categoryPageCountMap: Map<any, number>): CategoryView {
    for (let category of list) {
        if (category.parentId === categoryView.id) {
            categoryView.children.push(getChildren({
                id: category.id!,
                name: category.name,
                parentId: category.parentId,
                createTime: category.createTime,
                updateTime: category.updateTime,
                children: [],
                postCount: categoryPostCountMap.has(category.id) ? categoryPostCountMap.get(category.id)! : 0,
                pageCount: categoryPageCountMap.has(category.id) ? categoryPageCountMap.get(category.id)! : 0
            }, list, categoryPostCountMap, categoryPageCountMap));
        }
    }
    return categoryView;
}

export default class CategoryService {

    categoryMapper: Database<Category>;
    postCategoryMapper: Database<PostCategory>;
    pageCategoryMapper: Database<PostCategory>;

    constructor(categoryMapper: Database<Category>, postCategoryMapper: Database<PostCategory>, pageCategoryMapper: Database<PostCategory>) {
        this.categoryMapper = categoryMapper;
        this.postCategoryMapper = postCategoryMapper;
        this.pageCategoryMapper = pageCategoryMapper;
    }

    /**
     * 返回全部
     */
    async list(): Promise<Array<CategoryView>> {
        let postCategories = this.postCategoryMapper!.list();
        let categoryPostCountMap = ArrayUtil.count(postCategories, 'categoryId');
        let pageCategories = this.pageCategoryMapper!.list();
        let categoryPageCountMap = ArrayUtil.count(pageCategories, 'categoryId');
        let categories = this.categoryMapper?.list()!;
        return Promise.resolve(tree(categories, categoryPostCountMap, categoryPageCountMap))
    }

    /**
     * 插入一个分类
     * @param category
     */
    async insert(category: {
        name: string,
        parentId: number
    }): Promise<number> {
        if (category.name === "") {
            return Promise.reject('分类名称不能为空');
        }
        // 先查询这个父ID是否存在
        let categoryTemp = await this.categoryMapper?.one({parentId: category.parentId, name: category.name});
        if (categoryTemp) {
            // 存在则直接返回
            return Promise.reject('分类已存在，无法插入');
        } else {
            // 不存在，则插入
            return this.categoryMapper?.insert({
                name: category.name,
                parentId: category.parentId,
                createTime: new Date(),
                updateTime: new Date()
            })!;
        }
    }

    async update(category: Category): Promise<number> {
        if (category.name === "") {
            return Promise.reject('分类名称不能为空');
        }
        let categoryTemp = await this.categoryMapper?.one({id: category.id});
        if (categoryTemp) {
            category.createTime = categoryTemp.createTime;
            category.updateTime = new Date();
            await this.categoryMapper?.update(category);
            return Promise.resolve(1);
        } else {
            return Promise.reject('分类不存在，无法修改');
        }
    }

    async removeById(id: number): Promise<void> {
        console.log('删除分类', id)
        return this.categoryMapper?.delete(id);
    }

}
