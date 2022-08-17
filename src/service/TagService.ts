import Tag from '@/entities/Tag';
import PostTag from '@/entities/PostTag';

import TagView from '@/views/TagView';
import Database from "@/plugins/Database";
import Constant from "@/global/Constant";
import ArrayUtil from "@/utils/ArrayUtil";

export default class TagService {


    tagMapper: Database<Tag> | undefined;
    postTagMapper: Database<PostTag> | undefined;


    async init(): Promise<void> {
        this.tagMapper = new Database<Tag>(await Constant.FILE.DB_TAG());
        await this.tagMapper?.init();
        this.postTagMapper = new Database<PostTag>(await Constant.FILE.DB_POST_TAG());
        await this.postTagMapper?.init();
    }

    async insert(tagName: string, fromPostId: number | void): Promise<void> {
        if (tagName === "") {
            return Promise.reject('标签名称不能为空');
        }
        let tags = await this.tagMapper?.list({name: tagName});
        let tag = (tags && tags.length > 0) ? tags[0] : undefined;
        if (tag) {
            if (fromPostId) {
                this.postTagMapper?.insert({
                    postId: fromPostId,
                    tagId: tag.id
                } as PostTag);
            } else {
                return Promise.reject('分类已存在，无法插入');
            }
        } else {
            // 没有标签，先新增标签
            let tagId = await this.tagMapper?.insert({
                name: tagName,
                createTime: new Date(),
                updateTime: new Date()
            } as Tag);
            // 存在这个标签，插入一个记录
            if (fromPostId) {
                // 只有根据文章来的才插入记录
                this.postTagMapper?.insert({
                    postId: fromPostId,
                    tagId: tagId
                } as PostTag);
            }
        }
        return Promise.resolve();
    }

    async update(id: number, name: string): Promise<void> {
        if (name === "") {
            return Promise.reject('标签名称不能为空')
        }
        let tag = await this.tagMapper?.info(id);
        if (!tag) {
            // 标签不存在
            return Promise.reject('标签不存在')
        }
        return this.tagMapper!.update({
            id: id,
            name: name,
            createTime: tag.createTime,
            updateTime: new Date()
        })
    }

    async list(): Promise<TagView[]> {
        let tags = await this.tagMapper?.list()!;
        let postTags = await this.postTagMapper?.list()!;
        let tagViews = new Array<TagView>();
        for (let tag of tags) {
            let tagView = {
                id: tag.id,
                name: tag.name,
                createTime: tag.createTime,
                postCount: ArrayUtil.size(postTags, 'tagId', tag.id)
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
        let tagPostCount = await this.postTagMapper?.count('tagId', id)!;
        if (tagPostCount > 0) {
            return Promise.reject('此标签已被文章关联，请先删除文章后再删除标签');
        }
        await this.tagMapper?.delete([id]);
        return new Promise<void>(resolve => {
            resolve();
        })
    }

}
