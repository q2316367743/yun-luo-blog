import {Dexie} from 'dexie';
import DexieInstance from '@/plugins/dexie';
import Category from "@/entities/Category";
import CategoryView from "@/views/CategoryView";
import PostCategory from "@/entities/PostCategory";
import ArrayUtil from "@/utils/ArrayUtil";

/**
 * 将列表转为树形
 * @param list 列表
 * @param categoryCountMap 文章分类映射
 */
function tree(list: Array<Category>, categoryCountMap: Map<any, number>): Array<CategoryView> {
    let views = new Array<CategoryView>();
    for (let category of list) {
        if (category.parentId === 0) {
            views.push(getChildren({
                id: category.id!,
                name: category.name,
                createTime: category.createTime,
                updateTime: category.updateTime,
                children: [],
                postCount: categoryCountMap.has(category.id) ? categoryCountMap.get(category.id)! : 0
            }, list, categoryCountMap));
        }
    }
    return views;
}

function getChildren(categoryView: CategoryView, list: Array<Category>, categoryCountMap: Map<any, number>): CategoryView {
    for (let category of list) {
        if (category.parentId === categoryView.id) {
            categoryView.children.push(getChildren({
                id: category.id!,
                name: category.name,
                createTime: category.createTime,
                updateTime: category.updateTime,
                children: [],
                postCount: categoryCountMap.has(category.id) ? categoryCountMap.get(category.id)! : 0
            }, list, categoryCountMap));
        }
    }
    return categoryView;
}

export default class CategoryService {

    postCategoryDao: Dexie.Table<PostCategory, number>;
    categoryDao: Dexie.Table<Category, number>;

    constructor(dexieInstance: DexieInstance) {
        this.postCategoryDao = dexieInstance.getPostCategoryDao();
        this.categoryDao = dexieInstance.getCategoryDao();
    }

    /**
     * 返回全部
     */
    async list(): Promise<Array<CategoryView>> {
        let postCategories = await this.postCategoryDao.toArray();
        let categoryCountMap = ArrayUtil.count(postCategories, 'categoryId');
        let categories = await this.categoryDao.toArray();
        return new Promise<Array<CategoryView>>((resolve) => {
            resolve(tree(categories, categoryCountMap));
        })
    }

    /**
     * 插入一个分类
     * @param category
     */
    async insert(category: {
        name: string,
        parentId: number
    }): Promise<number> {
        // 先查询这个父ID是否存在
        let categoryTemp = await this.categoryDao.where({parentId: category.parentId, name: category.name})
            .first();
        if (categoryTemp) {
            // 存在则直接返回
            return new Promise<number>((resolve, reject) => {
                reject('分类已存在，无法插入');
            })
        } else {
            // 不存在，则插入
            return this.categoryDao.add({
                name: category.name,
                parentId: category.parentId,
                createTime: new Date(),
                updateTime: new Date()
            });
        }
    }

    async update(category: Category): Promise<number> {
        let categoryTemp = await this.categoryDao.where({id: category.id})
            .first();
        if (categoryTemp) {
            category.createTime = categoryTemp.createTime;
            category.updateTime = new Date();
            return this.categoryDao.put(category);
        } else {
            return new Promise<number>((resolve, reject) => {
                reject('分类不存在，无法修改');
            })
        }
    }

    async removeById(id: number): Promise<void> {
        console.log('删除分类', id)
        return this.categoryDao.delete(id);
    }

}
