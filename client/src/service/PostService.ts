import {ElLoading, ElMessage} from 'element-plus';

import emitter from '@/plugins/mitt';
import Database from "@/plugins/Database";

import Constant from '@/global/Constant';

import ArrayUtil from '@/utils/ArrayUtil';
import {deleteByPath, parsePost, savePost} from '@/utils/PostUtil'

import FileApi from "@/api/FileApi";

import Post from '@/entities/Post';
import PostTag from '@/entities/PostTag';
import Tag from '@/entities/Tag';
import PostCategory from "@/entities/PostCategory";
import Category from "@/entities/Category";

import PostListView from '@/views/PostListView';
import MessageEventEnum from "@/enumeration/MessageEventEnum";

export default class PostService {

    tagDb: Database<Tag>;
    categoryDb: Database<Category>;
    postDb: Database<Post>;
    postTagDb: Database<PostTag>;
    postCategoryDb: Database<PostCategory>;
    private readonly type: string;

    constructor(
        type: string,
        tagDb: Database<Tag>,
        categoryDb: Database<Category>,
        postDb: Database<Post>,
        postTagDb: Database<PostTag>,
        postCategoryDb: Database<PostCategory>
    ) {
        this.type = type;
        this.tagDb = tagDb;
        this.categoryDb = categoryDb;
        this.postDb = postDb;
        this.postTagDb = postTagDb;
        this.postCategoryDb = postCategoryDb;
    }

    async insert(post: PostListView, folder: string, saveContent: boolean = true): Promise<void> {
        // 如果没有路径，先生成目录和文件名
        console.log('如果没有文件名，先生成文件名')
        if (!post.fileName || post.fileName === '') {
            post.fileName = post.title + ".md";
            console.log('先生成文件名', post.fileName);
        }
        console.log('开始插入')
        // 先插入文章
        let postId = await this.postDb.insert(this.viewToPost(post, false));
        console.log('插入完成', postId);
        // 再插入标签
        console.log('再插入标签')
        if (post.tags) {
            await this.insertTag(postId, post.tags);
        }
        // 再插入分类
        console.log('再插入分类')
        if (post.categories) {
            await this.insertCategory(postId, post.categories);
        }
        if (saveContent) {
            console.log('此处保存内容')
            // 此处保存内容
            savePost(this.type, post).then(() => {
                // 保存完后，发布新增事件
                emitter.emit(MessageEventEnum.POST_ADD);
            });
        }
    }

    async update(post: PostListView): Promise<void> {
        // 先查询文章
        console.log('先查询文章', post.id);
        let oldPost = this.postDb.one({id: post.id});
        console.log('旧文章')
        if (!oldPost) {
            return Promise.reject('文章不存在，请刷新后重试');
        }
        // 先修改文章
        console.log('先修改文章')
        let postId = post.id!;
        let tempPost = this.viewToPost(post);
        tempPost.id = post.id!
        await this.postDb.update(tempPost);
        // 删除旧的标签
        console.log('删除旧的标签')
        let oldPostTags = this.postTagDb.list({postId: post.id});
        for (let oldPostTag of oldPostTags) {
            await this.postTagDb.delete(oldPostTag.id!);
        }
        // 删除旧的分类
        let postCategories = this.postCategoryDb.list({postId: post.id});
        for (let postCategory of postCategories) {
            await this.postCategoryDb.delete(postCategory.id!);
        }
        // 在插入新的关系
        console.log('在插入新的关系')
        // 插入标签
        await this.insertTag(postId, post.tags,);
        // 插入分类
        await this.insertCategory(postId, post.categories);
        // 此处保存内容
        console.log('此处保存内容')
        savePost(this.type, post).then(() => {
            // 文章保存完，发送更新事件
            emitter.emit(MessageEventEnum.POST_UPDATE);
        });
    }

    private async insertTag(
        postId: number,
        tags: Array<string>) {
        if (!tags) {
            return;
        }
        for (let tagName of tags) {
            if (tagName === "") {
                // 标签为空，跳过
                continue;
            }
            let tag = this.tagDb.one({name: tagName});
            if (tag) {
                // 如果存在标签，则直接插入关系
                await this.postTagDb.insert({
                    postId: postId,
                    tagId: tag.id!
                });
            } else {
                // 不存在标签，则先插入
                let tagId = await this.tagDb.insert({
                    name: tagName,
                    createTime: new Date(),
                    updateTime: new Date()
                });
                // 之后插入标签
                // 如果存在标签，则直接插入关系
                await this.postTagDb.insert({
                    postId: postId,
                    tagId: tagId
                });
            }
        }
    }


    private async insertCategory(
        postId: number,
        categories: Array<string>): Promise<void> {
        if (!categories) {
            return;
        }
        // 先删除旧的分类关系
        console.log('先删除旧的分类关系');
        let oldPostCategory = this.postCategoryDb.one({postId: postId});
        if (oldPostCategory) {
            // 如果存在旧的分类关系，则删除旧的
            console.log('如果存在旧的分类关系，则删除旧的', oldPostCategory, oldPostCategory.id)
            await this.postCategoryDb.delete(oldPostCategory.id!);
        }
        // 先查询分类，分类按顺序排序，且只插入最后一个分类
        console.log("先查询分类，分类按顺序排序，且只插入最后一个分类")
        let parentId = 0;
        for (let categoryName of categories) {
            if (categoryName === "") {
                // 分类为空，跳过
                continue;
            }
            // 先查询这个分类是否存在
            console.log('先查询这个分类是否存在', categoryName, parentId)
            let category = await this.categoryDb.one({
                name: categoryName,
                parentId: parentId
            });
            if (category) {
                console.log('存在分类，则跳过', category.id!)
                // 存在分类，则跳过
                parentId = category.id!;
            } else {
                // 不存在则新增
                parentId = await this.categoryDb.insert({
                    name: categoryName,
                    createTime: new Date(),
                    parentId: parentId,
                    updateTime: new Date(),
                });
                console.log('不存在则新增', parentId)
            }
        }
        // 将最后一个分类与文章绑定
        await this.postCategoryDb.insert({
            postId: postId,
            categoryId: parentId,
            createTime: new Date()
        })
    }

    async list(condition?: Partial<Post>): Promise<Array<PostListView>> {
        let posts = this.postDb.list(condition);
        if (posts.length === 0) {
            return Promise.resolve([]);
        }
        // 根据文章查询标签
        let postTag = this.postTagDb.list();
        let tags = this.tagDb.list();
        let postTagMap = ArrayUtil.group(postTag, 'postId');
        let tagMap = ArrayUtil.map(tags, 'id');
        // 查询全部的分类
        let postCategories = this.postCategoryDb.list();
        let postCategoryMap = ArrayUtil.map(postCategories, 'postId');
        let categories = this.categoryDb.list();
        let categoryMap = ArrayUtil.map(categories, 'id');
        return Promise.resolve(posts.map(post => {
            let view = {
                ...post,
                type: this.type
            } as PostListView;
            // 处理标签
            let postTags = postTagMap.get(post.id);
            let tagList = Array<string>();
            if (postTags) {
                for (let item of postTags) {
                    let tag = tagMap.get(item.tagId);
                    if (tag) {
                        tagList.push(tag.name);
                    }
                }
            }
            view.tags = tagList;
            view.categories = new Array<string>();
            // 查询分类
            let postCategory = postCategoryMap.get(post.id);
            if (postCategory) {
                // 存在分类
                this.renderCategoryName(categoryMap, view.categories, postCategory.categoryId);
                view.categories = view.categories.reverse();
            }
            return view;
        }));
    }

    private renderCategoryName(
        categoryMap: Map<number, Category>,
        categories: Array<string>,
        id: number): void {
        let category = categoryMap.get(id);
        if (category) {
            categories.push(category.name);
            if (category.parentId === 0) {
                return;
            } else {
                this.renderCategoryName(categoryMap, categories, category.parentId);
            }
        }
    }

    async info(id: number): Promise<PostListView | void> {
        let post = this.postDb.one({id: id});
        let view = await parsePost(this.type, post!.fileName);
        if (view) {
            view.type = this.type;
            view.id = id;
        }
        // 查询全部
        return view;
    }

    async refresh(path: string): Promise<void> {
        const loading = ElLoading.service({
            lock: true,
            text: '获取目录中',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            // 获取文件
            let postPath = await Constant.FOLDER.POST()
            let files = await FileApi.listDir(postPath);
            // 获取全部文章目录
            let posts = this.postDb.list();
            // 删除全部文章
            for (let post of posts) {
                await this.postDb.delete(post.id!);
            }
            // 删除全部标签关系
            let postTags = this.postTagDb.list();
            for (let postTag of postTags) {
                await this.postTagDb.delete(postTag.id!);
            }
            // 删除旧的分类关系
            let postCategories = this.postCategoryDb.list();
            for (let postCategory of postCategories) {
                await this.postCategoryDb.delete(postCategory.id!);
            }
            let index = 0;
            for (let file of files) {
                index += 1;
                if (loading) {
                    loading.setText(`开始处理${index} / ${files.length}`);
                }
                if (file.isDirectory) {
                    // 跳过文件夹
                    continue;
                }
                let postView = await parsePost(file.path, file.name!, false);
                if (postView) {
                    // 处理逻辑，此处会报错，
                    try {
                        await this.insert(postView, path, false);
                    } catch (e) {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: `新增【${postView.title}】失败`
                        });
                    }
                }
            }
        } catch (e) {
            console.error(e);
            ElMessage({
                showClose: true,
                type: 'error',
                message: `新增失败，${e}`
            });
        } finally {
            loading.close();
        }
        return new Promise<void>((resolve) => {
            resolve();
        })
    }

    async deleteById(id: number): Promise<void> {
        // 先查询文章
        let post = this.postDb.one({id: id});
        if (!post) {
            return Promise.reject('文章不存在，请刷新后重试');
        }
        // 删除标签关联
        await this.postTagDb.deleteWhere({postId: id});
        // 删除分类关联
        await this.postCategoryDb.deleteWhere({postId: id});
        // 删除文章
        await this.postDb.delete(id);
        // 删除内容
        await deleteByPath(this.type, post.fileName)
        // 删除结束
        emitter.emit(MessageEventEnum.POST_DELETE);
        return Promise.resolve();
    }

    private viewToPost(postView: PostListView | Post, isIncludeId: boolean = true): Post {
        let post = {
            title: postView.title,
            fileName: postView.fileName,
            layout: postView.layout,
            status: postView.status,
            date: postView.date,
            updated: postView.updated,
            comments: postView.comments,
            permalink: postView.permalink,
            excerpt: postView.excerpt,
            disableNunjucks: postView.disableNunjucks,
            lang: postView.lang,
        } as Post;
        if (isIncludeId) {
            post.id = postView.id!;
        }
        return post;
    }

}
