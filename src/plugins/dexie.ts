import Dexie from 'dexie';

import Post from '@/entities/Post';;
import PostTag from '@/entities/PostTag';
import Tag from '@/entities/Tag';

export default class DexieInstance extends Dexie {

    private readonly postDao: Dexie.Table<Post, number>;
    private readonly postTagDao: Dexie.Table<PostTag, number>;
    private readonly tagDao: Dexie.Table<Tag, number>;

    constructor() {
        super('yun-luo-blog');
        this.version(1).stores({
            Post: '++id, title, fileName, &path, status, date, updated, comments, permalink, excerpt, disableNunjucks, lang',
            PostTag: '++id, postId, tagId',
            Tag: '++id, &name, createTime, updateTime',

        }).upgrade(trans => {
            console.log(trans)
        })
        this.tagDao = this.table('Tag');
        this.postTagDao = this.table('PostTag');
        this.postDao = this.table('Post');
    }

    public getPostDao(): Dexie.Table<Post, number> {
        return this.postDao;
    }

    public getPostTagDao(): Dexie.Table<PostTag, number> {
        return this.postTagDao;
    }

    public getTagDao(): Dexie.Table<Tag, number> {
        return this.tagDao;
    }

}