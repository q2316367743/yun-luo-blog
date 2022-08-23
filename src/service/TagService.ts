import Tag from '@/entities/Tag';
import PostTag from '@/entities/PostTag';

import TagView from '@/views/TagView';
import Database from "@/plugins/Database";
import ArrayUtil from "@/utils/ArrayUtil";

export default class TagService {


    tagDb: Database<Tag>;
    postTagDb: Database<PostTag>;
    pageTagDb: Database<PostTag>;

    constructor(tagDb: Database<Tag>, postTagDb: Database<PostTag>, pageTagDb: Database<PostTag>) {
        this.tagDb = tagDb;
        this.postTagDb = postTagDb;
        this.pageTagDb = pageTagDb;
    }

    async insert(tagName: string): Promise<void> {
        if (tagName === "") {
            return Promise.reject('标签名称不能为空');
        }
        let tags = await this.tagDb?.list({name: tagName});
        let tag = (tags && tags.length > 0) ? tags[0] : undefined;
        if (tag) {
            return Promise.reject('分类已存在，无法插入');
        } else {
            // 没有标签，先新增标签
            await this.tagDb?.insert({
                name: tagName,
                createTime: new Date(),
                updateTime: new Date()
            } as Tag);
        }
        return Promise.resolve();
    }

    async update(id: number, name: string): Promise<void> {
        if (name === "") {
            return Promise.reject('标签名称不能为空')
        }
        let tag = await this.tagDb?.info(id);
        if (!tag) {
            // 标签不存在
            return Promise.reject('标签不存在')
        }
        return this.tagDb!.update({
            id: id,
            name: name,
            createTime: tag.createTime,
            updateTime: new Date()
        })
    }

    async list(): Promise<TagView[]> {
        let tags = this.tagDb?.list()!;
        let postTags = this.postTagDb?.list()!;
        let pageTags = this.pageTagDb?.list()!;
        let tagViews = new Array<TagView>();
        for (let tag of tags) {
            let tagView = {
                id: tag.id,
                name: tag.name,
                createTime: tag.createTime,
                postCount: ArrayUtil.size(postTags, 'tagId', tag.id),
                pageCount: ArrayUtil.size(pageTags, 'tagId', tag.id)
            } as TagView;
            tagViews.push(tagView);
        }
        return Promise.resolve(tagViews);
    }

    /**
     * 根据ID删除标签
     *
     * @param id 标签ID
     */
    async removeById(id: number): Promise<void> {
        let tagPostCount = this.postTagDb?.count({tagId: id})!;
        if (tagPostCount > 0) {
            return Promise.reject('此标签已被文章关联，请先删除文章后再删除标签');
        }
        await this.tagDb?.delete(id);
        return new Promise<void>(resolve => {
            resolve();
        })
    }

}
