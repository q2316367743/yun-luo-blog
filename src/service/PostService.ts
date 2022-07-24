import { Dexie, Transaction } from 'dexie';
import { ElLoading } from 'element-plus';

import { readDir, BaseDirectory } from '@tauri-apps/api/fs';
import { resolve, documentDir } from '@tauri-apps/api/path';

import constant from '@/global/constant';

import DexieInstance from '@/plugins/dexie';
import constants from '@/global/constant';

import ArrayUtil from '@/utils/ArrayUtil';
import { parsePost, savePost } from '@/utils/PostUtil'
import { deleteByPath } from '@/utils/PostUtil'

import Post from '@/entities/Post';
import PostTag from '@/entities/PostTag';
import Tag from '@/entities/Tag';

import PostView from '@/views/PostView';

export default class TagService {

    dexieInstance: DexieInstance;
    postDao: Dexie.Table<Post, number>;
    postTagDao: Dexie.Table<PostTag, number>;
    tagDao: Dexie.Table<Tag, number>;

    constructor(dexieInstance: DexieInstance) {
        this.dexieInstance = dexieInstance;
        this.postDao = dexieInstance.getPostDao();
        this.postTagDao = dexieInstance.getPostTagDao();
        this.tagDao = dexieInstance.getTagDao();
    }

    async insert(post: PostView): Promise<void> {
        return this.dexieInstance.transaction('readwrite',
        ["Post", "PostTag", "Tag"],
            async (trans: Transaction) => {
                console.log('先新增文章')
                // 先新增文章
                let postDao = trans.table('Post') as Dexie.Table<Post, number>;
                let postTagDao = trans.table('PostTag') as Dexie.Table<PostTag, number>;
                let tagDao = trans.table('Tag') as Dexie.Table<Tag, number>;
                await this.insertSelf(post, postDao, postTagDao, tagDao);
            });
    }

    private async insertSelf(post: PostView,
        postDao: Dexie.Table<Post, number>,
        postTagDao: Dexie.Table<PostTag, number>,
        tagDao: Dexie.Table<Tag, number>) {
        // 如果没有路径，先生成目录和文件名
        if (!post.path || post.path === '') {
            post.path = await resolve(await documentDir(), constant.BASE, constant.POST, post.title + ".md");
            post.fileName = post.title + ".md";
            console.log('先生成目录和文件名', post.path, post.fileName);
        }
        // 先插入文章
        let postId = await postDao.put(this.viewToPost(post, false));
        console.log('插入完成', postId);
        // 再插入标签
        for (let tagName of post.tags) {
            let tag = await tagDao.where({ name: tagName }).first();
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
                    createTime: new Date()
                });
                // 之后插入标签
                // 如果存在标签，则直接插入关系
                postTagDao.add({
                    postId: postId,
                    tagId: tagId
                });
            }
        }
        // 此处保存内容
        savePost(post);
    }

    async update(post: PostView): Promise<void> {
        return this.dexieInstance.transaction('readwrite',
            ["Post", "PostTag", "Tag"],
            async (trans: Transaction) => {
                let postDao = trans.table('Post') as Dexie.Table<Post, number>;
                let postTagDao = trans.table('PostTag') as Dexie.Table<PostTag, number>;
                let tagDao = trans.table('Tag') as Dexie.Table<Tag, number>;
                await this.updateSelf(post, postDao, postTagDao, tagDao);
            });
    }

    private async updateSelf(post: PostView,
        postDao: Dexie.Table<Post, number>,
        postTagDao: Dexie.Table<PostTag, number>,
        tagDao: Dexie.Table<Tag, number>) {
        // 先查询文章
        let oldPost = await postDao.where({ id: post.id }).first();
        if (!oldPost) {
            return new Promise<void>((resolve, reject) => {
                reject('文章不存在，请刷新后重试');
            })
        }
        // 先修改文章
        let postId = await postDao.update(post.id!,
            Object.assign(oldPost, post));
        // 删除旧的分类
        let oldPostTags = await postTagDao.where({ postId: post.id }).toArray();
        for (let oldPostTag of oldPostTags) {
            await postTagDao.delete(oldPostTag.id!);
        }
        // 在插入新的关系
        for (let tagName of post.tags) {
            let tag = await tagDao.where({ name: tagName }).first()
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
                    createTime: new Date()
                });
                // 之后插入标签
                // 如果存在标签，则直接插入关系
                postTagDao.add({
                    postId: postId,
                    tagId: tagId
                });
            }
        }
        // 此处保存内容
        savePost(post);
    }

    async list(): Promise<Array<PostView>> {
        // 查询文章
        let posts = await this.postDao.toArray();
        if (posts.length === 0) {
            return new Promise<Array<PostView>>((resolve, reject) => {
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
        let postTagMap = ArrayUtil.group(postTag, 'postId');
        let tagMap = ArrayUtil.map(tags, 'id');
        return new Promise<Array<PostView>>((resolve, reject) => {
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
                // TODO: 分类渲染
                view.categories = new Array<string>();
                return view;
            }));
        })
    }

    info(id: number): Promise<Post | undefined> {
        return this.postDao.where({ id: id }).first();
    }

    async refresh(): Promise<void> {
        const loading = ElLoading.service({
            lock: true,
            text: '获取目录中',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        // 获取文件
        let documentPath = await documentDir();
        let path = await resolve(documentPath, constants.BASE, constants.POST);
        let files = await readDir(path, { dir: BaseDirectory.Document, recursive: false });
        // 获取全部文章目录
        let posts = await this.postDao.toArray();
        let postPathMap = ArrayUtil.map(posts, 'path');
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
                // 处理逻辑
                if (postPathMap.has(file.path)) {
                    let post = postPathMap.get(file.path);
                    postView.id = post?.id!;
                    // 存在则修改
                    console.log("存在则修改")
                    await this.update(postView);
                } else {
                    console.log('开始新增')
                    // 不存在则新增
                    await this.insert(postView);
                }
            }
        }
        loading.close();
        return new Promise<void>((resolve, reject) => {
            resolve();
        })
    }

    deleteById(id: number): Promise<Post> {
        return this.dexieInstance.transaction('readwrite',
            [this.postDao, this.postTagDao, this.tagDao],
            async (trans: Transaction) => {
                let postDao = trans.table('Post') as Dexie.Table<Post, number>;
                let postTagDao = trans.table('PostTag') as Dexie.Table<PostTag, number>;
                // 先查询文章
                let post = await postDao.where({ id: id }).first();
                if (!post) {
                    return new Promise<void>((resolve, reject) => {
                        reject('文章不存在，请刷新后重试');
                    });
                }
                // 删除文章
                await postDao.delete(post.id);
                // 删除标签关联
                let postTags = await postTagDao.where({ postId: post.id }).toArray();
                for (let postTag of postTags) {
                    await postTagDao.delete(postTag.id!);
                }
                // 删除内容
                await deleteByPath(post.path)
                return new Promise<Post>((resolve, reject) => {
                    resolve(post!);
                });
            }) as Promise<Post>;
    }

    private viewToPost(postView: PostView, isIncludeId: boolean = true): Post {
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
