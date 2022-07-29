import {Dexie} from 'dexie';
import DexieInstance from '@/plugins/dexie';
import Category from "@/entities/Category";
import CategoryView from "@/views/CategoryView";

/**
 * 将列表转为树形
 * @param list 列表
 */
function tree(list: Array<Category>): Array<CategoryView> {
    let views = new Array<CategoryView>();
    for (let category of list) {
        if (category.parentId === 0) {
            views.push(getChildren({
                id: category.id!,
                name: category.name,
                createTime: category.createTime,
                updateTime: category.updateTime,
                children: []
            }, list))
        }
    }
    return views;
}

function getChildren(categoryView: CategoryView, list: Array<Category>): CategoryView {
    for (let category of list) {
        if (category.parentId === categoryView.id) {
            categoryView.children.push(getChildren({
                id: category.id!,
                name: category.name,
                createTime: category.createTime,
                updateTime: category.updateTime,
                children: []
            }, list));
        }
    }
    return categoryView;
}

export default class CategoryService {

    categoryDap: Dexie.Table<Category, number>;

    constructor(dexieInstance: DexieInstance) {
        this.categoryDap = dexieInstance.getCategoryDao();
    }

    /**
     * 返回全部
     */
    async list(): Promise<Array<CategoryView>> {
        let categories = await this.categoryDap.toArray();
        return new Promise<Array<CategoryView>>((resolve) => {
            resolve(tree(categories));
        })
    }

    /**
     * 插入一个分类
     * @param category
     */
    async insert(category: Category): Promise<number> {
        // 先查询这个父ID是否存在
        let categoryTemp = await this.categoryDap.where({parentId: category.parentId, name: category.name})
            .first();
        if (categoryTemp) {
            // 存在则直接返回
            return new Promise<number>((resolve, reject) => {
                reject('分类已存在，无法插入');
            })
        }else {
            // 不存在，则插入
            category.createTime = new Date();
            category.updateTime = new Date();
            return this.categoryDap.add(category);
        }
    }

    async update(category: Category): Promise<number> {
        let categoryTemp = await this.categoryDap.where({id: category.id})
            .first();
        if (categoryTemp) {
            category.createTime = categoryTemp.createTime;
            category.updateTime = new Date();
            return this.categoryDap.put(category);
        }else {
            return new Promise<number>((resolve, reject) => {
                reject('分类不存在，无法修改');
            })
        }
    }

    async remove(id: number): Promise<void> {
        return this.categoryDap.delete(id);
    }

}
