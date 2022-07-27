import {Dexie} from 'dexie';
import DexieInstance from '@/plugins/dexie';
import Category from "@/entities/Category";
import CategoryView from "@/views/CategoryView";

/**
 * 将列表转为树形
 * @param list 列表
 */
function tree(list: Array<Category>): Array<CategoryView> {
    return list.map(e => {
        return {
            id: e.id,
            name: e.name,
            postId: e.postId,
            createTime: e.createTime,
            updateTime: e.updateTime,
            children: getChildren(e.id, list)
        }
    })
}

function getChildren(id: number, list: Array<Category>): Array<CategoryView> {
    return list.filter(e => e.postId === id).map(e => {
        return {
            id: e.id,
            name: e.name,
            postId: e.postId,
            createTime: e.createTime,
            updateTime: e.updateTime,
            children: []
        }
    });
}

console.log(tree([{
    id: 1,
    name: 'a',
    parentId: 0,
    postId: 0,
    createTime: new Date(),
    updateTime: new Date()
}, {
    id: 2,
    name: 'b',
    parentId: 1,
    postId: 0,
    createTime: new Date(),
    updateTime: new Date()
}, {
    id: 3,
    name: 'c',
    parentId: 0,
    postId: 0,
    createTime: new Date(),
    updateTime: new Date()
},{
    id: 4,
    name: 'd',
    parentId: 3,
    postId: 0,
    createTime: new Date(),
    updateTime: new Date()
}]))

export default class CategoryService {

    categoryDap: Dexie.Table<Category, number>;

    constructor(dexieInstance: DexieInstance) {
        this.categoryDap = dexieInstance.getCategoryDao();
    }

    /**
     * 返回全部
     */
    async listAll(): Promise<Array<CategoryView>> {
        let categories = await this.categoryDap.toArray();
        return new Promise<Array<CategoryView>>((resolve) => {
            resolve(tree(categories));
        })
    }

    async list(postId: number): Promise<Array<CategoryView>> {
        let categories = await this.categoryDap
            .where({postId: postId}).toArray();
        return new Promise<Array<CategoryView>>((resolve) => {
            resolve(tree(categories));
        })
    }

}
