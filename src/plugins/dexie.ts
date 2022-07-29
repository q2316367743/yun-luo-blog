import Dexie from 'dexie';

import Post from '@/entities/Post';
import PostTag from '@/entities/PostTag';
import PostCategory from "@/entities/PostCategory";
import Tag from '@/entities/Tag';
import Category from "@/entities/Category";

export default class DexieInstance extends Dexie {

    private readonly postDao: Dexie.Table<Post, number>;
    private readonly postTagDao: Dexie.Table<PostTag, number>;
    private readonly postCategoryDao: Dexie.Table<PostCategory, number>;
    private readonly tagDao: Dexie.Table<Tag, number>;
    private readonly categoryDao: Dexie.Table<Category, number>;

    constructor() {
        super('yun-luo-blog');
        this.version(1).stores({
            Post: '++id',
            PostTag: '++id, postId, tagId',
            PostCategory: '++id, postId, categoryId, [postId+categoryId]',
            Tag: '++id, &name',
            Category: '++id, name, parentId, [name+parentId]'

        }).upgrade(trans => {
            console.log(trans)
        })
        this.tagDao = this.table('Tag');
        this.postTagDao = this.table('PostTag');
        this.postCategoryDao = this.table('PostCategory');
        this.postDao = this.table('Post');
        this.categoryDao = this.table('Category');
    }

    public getPostDao(): Dexie.Table<Post, number> {
        return this.postDao;
    }

    public getPostTagDao(): Dexie.Table<PostTag, number> {
        return this.postTagDao;
    }

    public getPostCategoryDao(): Dexie.Table<PostCategory, number> {
        return this.postCategoryDao;
    }

    public getTagDao(): Dexie.Table<Tag, number> {
        return this.tagDao;
    }

    public getCategoryDao(): Dexie.Table<Category, number> {
        return this.categoryDao;
    }

}
