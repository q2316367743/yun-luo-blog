import {Dexie, Transaction} from 'dexie';
import DexieInstance from '@/plugins/dexie';

import Tag from '@/entities/Tag';
import PostTag from '@/entities/PostTag';

import TagView from '@/views/TagView';

export default class TagService {

    dexieInstance: DexieInstance;
    tagDao: Dexie.Table<Tag, number>;
    postTagDao: Dexie.Table<PostTag, number>;

    constructor(dexieInstance: DexieInstance) {
        this.dexieInstance = dexieInstance;
        this.tagDao = dexieInstance.getTagDao();
        this.postTagDao = dexieInstance.getPostTagDao();
    }

    async insert(tagName: string, fromPostId: number | void): Promise<void> {
        return this.dexieInstance.transaction('readwrite',
            [this.tagDao, this.postTagDao], async (trans: Transaction) => {
                let tagDao = trans.table('Tag') as Dexie.Table<Tag, number>;
                let postTagDao = trans.table('PostTag') as Dexie.Table<PostTag, number>;
                // 查询这个标签
                let tag = await tagDao.where({name: tagName}).first();
                if (tag) {
                    // 存在这个标签，插入一个记录
                    if (fromPostId) {
                        // 只有根据文章来的才插入记录
                        postTagDao.add({
                            postId: fromPostId,
                            tagId: tag.id
                        } as PostTag);
                    }
                } else {
                    // 没有标签，先新增标签
                    let tagId = await tagDao.add({
                        name: tagName,
                        createTime: new Date(),
                        updateTime: new Date()
                    } as Tag);
                    // 存在这个标签，插入一个记录
                    if (fromPostId) {
                        // 只有根据文章来的才插入记录
                        postTagDao.add({
                            postId: fromPostId,
                            tagId: tagId
                        } as PostTag);
                    }
                }
            });
    }

    async update(id: number, name: string): Promise<number> {
        console.log(id, name)
        let tag = await this.tagDao.where({id: id}).first();
        if (!tag) {
            // 标签不存在
            return new Promise<number>((resolve, reject) => {
                reject('标签不存在');
            })
        }
        return this.tagDao.update(id, {
            name: name,
            createTime: tag.createTime
        })
    }

    list(): Promise<TagView[]> {
        return this.dexieInstance.transaction(
            'readwrite',
            [this.tagDao, this.postTagDao],
            async (trans: Transaction) => {
                let tagDao = trans.table('Tag') as Dexie.Table<Tag, number>;
                let postTagDao = trans.table('PostTag') as Dexie.Table<PostTag, number>;
                let tagViews = new Array<TagView>();
                let tags = await tagDao.toArray();
                for (let tag of tags) {
                    let tagView = {
                        id: tag.id,
                        name: tag.name,
                        createTime: tag.createTime,
                        postCount: await postTagDao.where({tagId: tag.id}).count()
                    } as TagView;
                    tagViews.push(tagView);
                }
                return new Promise<Array<TagView>>((resolve, reject) => {
                    resolve(tagViews);
                })
            })
    }

}
