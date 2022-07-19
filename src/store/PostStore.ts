import { defineStore } from "pinia";

import { ElLoading } from 'element-plus';

import { readDir, BaseDirectory } from '@tauri-apps/api/fs';
import { resolve, documentDir } from '@tauri-apps/api/path';

import { useLocalStorage } from '@vueuse/core';

import { Post } from '@/types/Post';
import constants from '@/global/constant';
import ArrayUtil from "@/utils/ArrayUtil";
import { renderPost } from '@/utils/PostUtil';

let store = useLocalStorage('postStore', {
    posts: new Array<Post>(),
    postPaths: new Array<string>(),
    tagList: new Array<string>()
});

export const usePostStore = defineStore('post', {
    state: () => {
        return {
            // 全部的文章
            posts: store.value.posts,
            postPaths: store.value.postPaths,
            tagList: store.value.tagList
        }
    },
    getters: {
        /**
         * 返回全部的链接
         */
        list: (state): Array<Post> => {
            return state.posts;
        },
        tags: (state): Array<string> => {
            return state.tagList;
        }
    },
    actions: {
        /**
         * 刷新获取文章，此处为强制刷新，重新获取，渲染
         */
        async refresh(): Promise<boolean> {
            this.posts = [];
            this.postPaths = [];
            // 初始化时加载
            const loading = ElLoading.service({
                lock: true,
                text: '获取目录中',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            let rsp = await this.append(loading);
            loading.close();
            return rsp;
        },
        /**
         * 此处为追加刷新，只会新增没有的，删除不存在的
         */
        async append(loading?: any): Promise<boolean> {
            let documentPath = await documentDir();
            let path = await resolve(documentPath, constants.BASE, constants.POST);
            let files = await readDir(path, { dir: BaseDirectory.Document, recursive: false });
            let isUpdate = false;
            let index = 0;
            for (let file of files) {
                index += 1;
                if (loading) {
                    loading.setText(`开始处理${index} / ${files.length}`);
                }
                if (!file.children || file.children.length === 0) {
                    if (!ArrayUtil.contains(this.postPaths, file.path)) {
                        // 如果不存在，则增加
                        // 名字取文件内的
                        let post = await renderPost(file.path, file.name!);
                        if (!post) {
                            // 文章不存在，就跳过
                            break;
                        }
                        this.posts.push(post);
                        this.postPaths.push(file.path);
                        // 插入标签
                        for (let tag of post.tags) {
                            console.log(tag)
                            if (!ArrayUtil.contains(this.tagList, tag)) {
                                this.tagList.push(tag)
                            }
                        }
                        isUpdate = true;
                    }
                }
            }
            // tag去重
            store.value.posts = this.posts;
            store.value.postPaths = this.postPaths;
            store.value.tagList = this.tagList;
            return new Promise<boolean>((resolve, reject) => {
                resolve(isUpdate);
            })
        },
        /**
         * 此处问单个文章信息更新，用于编辑文章时更新
         * 
         * @param path 文章目录
         * @param post 新的文章详情
         */
        update(path: string, post: Post) {

        }
    }
})