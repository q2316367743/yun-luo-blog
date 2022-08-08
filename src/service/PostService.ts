import {Dexie, Transaction} from 'dexie';
import {ElLoading, ElMessage} from 'element-plus';


import DexieInstance from '@/plugins/dexie';
import Constant from '@/global/Constant';

import ArrayUtil from '@/utils/ArrayUtil';
import FileApi from "@/api/FileApi";
import {deleteByPath, parsePost, savePost} from '@/utils/PostUtil'

import Post from '@/entities/Post';
import PostTag from '@/entities/PostTag';
import Tag from '@/entities/Tag';

import PostView from '@/views/PostView';
import PostCategory from "@/entities/PostCategory";
import Category from "@/entities/Category";
import PostCondition from "@/condition/PostCondition";

export default class TagService {

    dexieInstance: DexieInstance;
    postDao: Dexie.Table<Post, number>;
    postTagDao: Dexie.Table<PostTag, number>;
    postCategoryDao: Dexie.Table<PostCategory, number>;
    tagDao: Dexie.Table<Tag, number>;
    categoryDao: Dexie.Table<Category, number>;

    constructor(dexieInstance: DexieInstance) {
        this.dexieInstance = dexieInstance;
        this.postDao = dexieInstance.getPostDao();
        this.postTagDao = dexieInstance.getPostTagDao();
        this.postCategoryDao = dexieInstance.getPostCategoryDao();
        this.tagDao = dexieInstance.getTagDao();
        this.categoryDao = dexieInstance.getCategoryDao();
    }

    async insert(post: PostView, saveContent: boolean = true): Promise<void> {
        return this.dexieInstance.transaction('readwrite',
            ["Post", "PostTag", "PostCategory", "Tag", "Category"],
            async (trans: Transaction) => {
                console.log('先新增文章')
                // 先新增文章
                let postDao = trans.table('Post') as Dexie.Table<Post, number>;
                let postTagDao = trans.table('PostTag') as Dexie.Table<PostTag, number>;
                let postCategoryDao = trans.table('PostCategory') as Dexie.Table<PostCategory, number>;
                let tagDao = trans.table('Tag') as Dexie.Table<Tag, number>;
                let categoryDao = trans.table('Category') as Dexie.Table<Category, number>;
                await this.insertSelf(post, postDao, postTagDao, postCategoryDao, tagDao, categoryDao, saveContent);
            });
    }

    private async insertSelf(post: PostView,
                             postDao: Dexie.Table<Post, number>,
                             postTagDao: Dexie.Table<PostTag, number>,
                             postCategoryDao: Dexie.Table<PostCategory, number>,
                             tagDao: Dexie.Table<Tag, number>,
                             categoryDao: Dexie.Table<Category, number>,
                             saveContent: boolean) {
        // 如果没有路径，先生成目录和文件名
        console.log('如果没有路径，先生成目录和文件名')
        if (!post.path || post.path === '') {
            let postPath = await Constant.PATH.POST();
            post.path = await FileApi.resolve(postPath, post.title + ".md");
            post.fileName = post.title + ".md";
            console.log('先生成目录和文件名', post.path, post.fileName);
        }
        console.log('开始插入')
        // 先插入文章
        let postId = await postDao.put(this.viewToPost(post, false));
        console.log('插入完成', postId);
        // 再插入标签
        console.log('再插入标签')
        if (post.tags) {
            await this.insertTag(postId, post.tags, postTagDao, tagDao);
        }
        // 再插入分类
        console.log('再插入分类')
        if (post.categories) {
            await this.insertCategory(postId, post.categories, postCategoryDao, categoryDao);
        }
        if (saveContent) {
            console.log('此处保存内容')
            // 此处保存内容
            savePost(post).then();
        }
    }

    async update(post: PostView, saveContent: boolean = true): Promise<void> {
        return this.dexieInstance.transaction('readwrite',
            ["Post", "PostTag", "PostCategory", "Tag", "Category"],
            async (trans: Transaction) => {
                let postDao = trans.table('Post') as Dexie.Table<Post, number>;
                let postTagDao = trans.table('PostTag') as Dexie.Table<PostTag, number>;
                let postCategoryDao = trans.table('PostCategory') as Dexie.Table<PostCategory, number>;
                let tagDao = trans.table('Tag') as Dexie.Table<Tag, number>;
                let categoryDao = trans.table('Category') as Dexie.Table<Category, number>;
                await this.updateSelf(post, postDao, postTagDao, postCategoryDao, tagDao, categoryDao, saveContent);
            });
    }

    private async updateSelf(
        post: PostView,
        postDao: Dexie.Table<Post, number>,
        postTagDao: Dexie.Table<PostTag, number>,
        postCategoryDao: Dexie.Table<PostCategory, number>,
        tagDao: Dexie.Table<Tag, number>,
        categoryDao: Dexie.Table<Category, number>,
        saveContent: boolean): Promise<void> {
        // 先查询文章
        console.log('先查询文章', post.id);
        let oldPost = await postDao.where({id: post.id}).first();
        console.log('旧文章', oldPost)
        if (!oldPost) {
            return new Promise<void>((resolve, reject) => {
                reject('文章不存在，请刷新后重试');
            })
        }
        // 先修改文章
        console.log('先修改文章', post)
        let postId = post.id!;
        await postDao.update(post.id!, this.viewToPost(post));
        // 删除旧的标签
        console.log('删除旧的标签')
        let oldPostTags = await postTagDao.where({postId: post.id}).toArray();
        for (let oldPostTag of oldPostTags) {
            await postTagDao.delete(oldPostTag.id!);
        }
        // 删除旧的分类
        let postCategories = await postCategoryDao.where({postId: post.id}).toArray();
        for (let postCategory of postCategories) {
            await postCategoryDao.delete(postCategory.id!);
        }
        // 在插入新的关系
        console.log('在插入新的关系')
        // 插入标签
        await this.insertTag(postId, post.tags, postTagDao, tagDao);
        // 插入分类
        await this.insertCategory(postId, post.categories, postCategoryDao, categoryDao);
        if (saveContent) {
            // 此处保存内容
            console.log('此处保存内容')
            savePost(post).then();
        }
    }

    private async insertTag(
        postId: number,
        tags: Array<string>,
        postTagDao: Dexie.Table<PostTag, number>,
        tagDao: Dexie.Table<Tag, number>) {
        for (let tagName of tags) {
            if (tagName === "") {
                // 标签为空，跳过
                continue;
            }
            let tag = await tagDao.where({name: tagName}).first()
            if (tag) {
                // 如果存在标签，则直接插入关系
                postTagDao.add({
                    postId: postId,
                    tagId: tag.id!
                });
            } else {
                // 不存在标签，则先插入
                let tagId = await tagDao.add({
                    name: tagName,
                    createTime: new Date(),
                    updateTime: new Date()
                });
                // 之后插入标签
                // 如果存在标签，则直接插入关系
                postTagDao.add({
                    postId: postId,
                    tagId: tagId
                });
            }
        }
    }


    private async insertCategory(
        postId: number,
        categories: Array<string>,
        postCategoryDao: Dexie.Table<PostCategory, number>,
        categoryDao: Dexie.Table<Category, number>): Promise<void> {
        // 先删除旧的分类关系
        console.log('先删除旧的分类关系');
        let oldPostCategory = await this.postCategoryDao.where('postId').equals(postId).first();
        if (oldPostCategory) {
            // 如果存在旧的分类关系，则删除旧的
            console.log('如果存在旧的分类关系，则删除旧的', oldPostCategory, oldPostCategory.id)
            await postCategoryDao.delete(oldPostCategory.id!);
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
            let category = await categoryDao.where(['name', 'parentId'])
                .equals([categoryName, parentId])
                .first();
            if (category) {
                console.log('存在分类，则跳过', category.id!)
                // 存在分类，则跳过
                parentId = category.id!;
            } else {
                // 不存在则新增
                parentId = await categoryDao.add({
                    name: categoryName,
                    createTime: new Date(),
                    parentId: parentId,
                    updateTime: new Date(),
                });
                console.log('不存在则新增', parentId)
            }
        }
        // 将最后一个分类与文章绑定
        postCategoryDao.add({
            postId: postId,
            categoryId: parentId,
            createTime: new Date()
        })
    }

    async list(condition?: PostCondition): Promise<Array<PostView>> {
        let where;
        let posts = new Array<Post>();
        if (condition) {
            if (condition.name) {
                where = this.postDao.where('name').equals(condition.name);
            }
            if (condition.status) {
                if (where) {
                    where = where.and(e => e.status == condition.status);
                } else {
                    where = this.postDao.where('status').equals(condition.status);
                }
            }
        }
        // 查询文章
        if (where) {
            // 具有条件
            posts = await where.toArray();
        } else {
            // 没有条件
            posts = await this.postDao.toArray();
        }
        if (posts.length === 0) {
            return new Promise<Array<PostView>>((resolve) => {
                resolve([]);
            });
        }
        // 根据文章查询标签
        let postTag = await this.postTagDao.where('postId')
            .anyOf(posts.map(e => e.id))
            .toArray();
        let tags = await this.tagDao.where('id')
            .anyOf(postTag.map(e => e.tagId))
            .toArray();
        // 查询全部的分类
        let postCategories = await this.postCategoryDao.toArray();
        let postCategoryMap = ArrayUtil.map(postCategories, 'postId');
        let categories = await this.categoryDao.toArray();
        let categoryMap = ArrayUtil.map(categories, 'id');
        let postTagMap = ArrayUtil.group(postTag, 'postId');
        let tagMap = ArrayUtil.map(tags, 'id');
        return new Promise<Array<PostView>>((resolve) => {
            resolve(posts.map(e => {
                let view = Object.assign({} as PostView, e);
                // 处理标签
                let postTags = postTagMap.get(e.id);
                let tagList = new Array<string>();
                if (postTags) {
                    for (let postTag of postTags) {
                        let tag = tagMap.get(postTag.tagId);
                        if (tag) {
                            tagList.push(tag.name);
                        }
                    }
                }
                view.tags = tagList;
                view.categories = new Array<string>();
                // 查询分类
                let postCategory = postCategoryMap.get(e.id);
                if (postCategory) {
                    // 存在分类
                    this.renderCategoryName(categoryMap, view.categories, postCategory.categoryId);
                    view.categories = view.categories.reverse();
                }
                return view;
            }));
        })
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

    info(id: number): Promise<Post | undefined> {
        return this.postDao.where({id: id}).first();
    }

    async refresh(): Promise<void> {
        const loading = ElLoading.service({
            lock: true,
            text: '获取目录中',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            // 获取文件
            let postPath = await Constant.PATH.POST()
            let files = await FileApi.listDir(postPath, true);
            // 获取全部文章目录
            let posts = await this.postDao.toArray();
            // 删除全部文章
            for (let post of posts) {
                this.postDao.delete(post.id);
            }
            // 删除全部标签关系
            let postTags = await this.postTagDao.toArray();
            for (let postTag of postTags) {
                this.postTagDao.delete(postTag.id!);
            }
            // 删除旧的分类关系
            let postCategories = await this.postCategoryDao.toArray();
            for (let postCategory of postCategories) {
                this.postCategoryDao.delete(postCategory.id!);
            }
            let index = 0;
            for (let file of files) {
                index += 1;
                if (loading) {
                    loading.setText(`开始处理${index} / ${files.length}`);
                }
                if (file.children) {
                    // 跳过文件夹
                    continue;
                }
                let postView = await parsePost(file.path, file.name!, false);
                if (postView) {
                    // 处理逻辑，此处会报错，
                    try {
                        await this.insert(postView, false);
                    }catch (e) {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: `新增【${postView.title}】失败`
                        });
                    }
                }
            }
        }catch (e) {
            console.error(e);
            ElMessage({
                showClose: true,
                type: 'error',
                message: `新增失败，${e}`
            });
        }finally {
            loading.close();
        }
        return new Promise<void>((resolve) => {
            resolve();
        })
    }

    deleteById(id: number): Promise<void> {
        return this.dexieInstance.transaction('readwrite',
            [this.postDao, this.postTagDao, this.tagDao],
            async (trans: Transaction) => {
                let postDao = trans.table('Post') as Dexie.Table<Post, number>;
                let postTagDao = trans.table('PostTag') as Dexie.Table<PostTag, number>;
                // 先查询文章
                let post = await postDao.where({id: id}).first();
                if (!post) {
                    return new Promise<void>((resolve, reject) => {
                        reject('文章不存在，请刷新后重试');
                    });
                }
                // 删除文章
                await postDao.delete(post.id);
                // 删除标签关联
                let postTags = await postTagDao.where({postId: post.id}).toArray();
                for (let postTag of postTags) {
                    await postTagDao.delete(postTag.id!);
                }
                // 删除内容
                await deleteByPath(post.path)
                return new Promise<void>((resolve) => {
                    resolve();
                });
            }) as Promise<void>;
    }

    private viewToPost(postView: PostView | Post, isIncludeId: boolean = true): Post {
        let post = {
            title: postView.title,
            fileName: postView.fileName,
            path: postView.path,
            status: postView.status,
            date: postView.date,
            updated: postView.updated,
            comments: postView.comments,
            permalink: postView.permalink,
            excerpt: postView.excerpt,
            disableNunjucks: postView.disableNunjucks,
            lang: postView.lang
        } as Post;
        if (isIncludeId) {
            post.id = postView.id!;
        }
        return post;
    }

}
