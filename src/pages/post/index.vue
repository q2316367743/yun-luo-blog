<template>
    <div id="post">
        <header class="header">
            <div class="left">
                <div class="left-delete" v-if="deletePostPath.length > 0">
                    <div style="margin-top: 1px;">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </div>
                    <div style="margin-left: 6px;">选中 {{ deletePostPath.length }}</div>
                </div>
            </div>
            <div class="right">
                <el-input v-model="keyword" placeholder="搜索文章" class="input-with-select" v-if="showSearch"
                    @blur="searchBlur" ref="searchInput" @input="searchPost">
                    <template #append>
                        <el-button :icon="search" @click="searchPost" />
                    </template>
                </el-input>
                <div class="option">
                    <el-button v-if="!showSearch" type="primary" link :icon="search" @click="showSearchClick">
                    </el-button>
                    <el-button type="primary" link :icon="refresh" @click="listPost"></el-button>
                    <el-button type="primary" link :icon="plus"></el-button>
                </div>
            </div>
        </header>
        <main class="main">
            <el-checkbox-group v-model="deletePostPath" v-if="posts.length > 0">
                <div v-for="(post, index) in showPosts" :key="index" class="post">
                    <div class="choose">
                        <el-checkbox :label="post.path"><br /></el-checkbox>
                    </div>
                    <div class="board">
                        <div class="title">{{ post.name }}</div>
                        <div class="description">
                            <div class="status" v-if="post.status === 1">
                                <span class="badge draft"></span>
                                <span>草稿</span>
                            </div>
                            <div class="status" v-else-if="post.status === 2">
                                <span class="badge release"></span>
                                <span>发布</span>
                            </div>
                            <div class="status" v-else-if="post.status === 3">
                                <span class="badge recycle"></span>
                                <span>回收站</span>
                            </div>
                            <div class="update-time">
                                <el-icon>
                                    <Calendar />
                                </el-icon>
                                <span>{{ formatDate(post.updateTime) }}</span>
                            </div>
                            <div class="tag">
                                <el-icon>
                                    <price-tag />
                                </el-icon>
                                <span v-for="tag in post.tag" class="tag-item">{{ tag }}</span>
                            </div>
                            <div class="category">
                                <el-icon>
                                    <collection-tag />
                                </el-icon>
                                <span v-for="category in post.category" class="category-item">{{ category }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-checkbox-group>
            <el-empty v-else description="暂无文章" style="margin-top: 110px;" />
        </main>
    </div>
</template>
<script lang="ts">
import { defineComponent, markRaw, ref } from "vue";
import { Search, Plus, Refresh, Calendar, PriceTag, CollectionTag, Delete } from '@element-plus/icons-vue';
import { readDir, BaseDirectory } from '@tauri-apps/api/fs';
import { resolve, documentDir } from '@tauri-apps/api/path';

import { Post, PostStatus } from '@/types/Post';
import constants from '@/global/constant';
import DateUtil from '@/utils/DateUtil';

export default defineComponent({
    name: 'post',
    components: { Calendar, PriceTag, CollectionTag, Delete },
    setup() {
        const search = markRaw(Search);
        const plus = markRaw(Plus);
        const refresh = markRaw(Refresh);
        return { search, plus, refresh }
    },
    data: () => ({
        keyword: '',
        showSearch: false,
        posts: new Array<Post>(),
        showPosts: new Array<Post>(),
        deletePostPath: new Array<string>(),
    }),
    created() {
        this.listPost();
    },
    methods: {
        formatDate: DateUtil.formatDate,
        searchBlur() {
            if (this.keyword === '') {
                this.showSearch = false;
            }
        },
        showSearchClick() {
            this.showSearch = true;
            this.$nextTick(() => {
                let searchInput = this.$refs.searchInput as HTMLElement;
                searchInput.focus();
            });
        },
        searchPost() {
            this.showPosts = [];
            this.posts.forEach(post => {
                if (post.name.indexOf(this.keyword) > -1) {
                    this.showPosts.push(post);
                }
            })
        },
        listPost() {
            // post列表
            this.posts = new Array<Post>();
            // 初始化列表
            documentDir().then(documentPath => {
                resolve(documentPath, constants.BASE, constants.POST).then(path => {
                    readDir(path, { dir: BaseDirectory.Document, recursive: true }).then(files => {
                        files.forEach(file => {
                            if (!file.children || file.children.length === 0) {
                                let name = file.name!;
                                name = name.substring(0, name.lastIndexOf('.'))
                                let post = {
                                    name: name,
                                    path: file.path!,
                                    status: PostStatus.RELEASE,
                                    updateTime: new Date(),
                                    tag: ['测试', '开发'],
                                    category: ['产品', '设计']
                                };
                                this.posts.push(post);
                                this.showPosts.push(post);
                            }
                        })
                    });
                })
            })
        }
    }
});
</script>
<style lang="less" scoped>
#post {
    padding: 10px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .header {
        display: flex;
        justify-content: space-between;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 42px;
        border-bottom: #eeeeee solid 1px;

        .left {
            padding: 5px;
            padding-left: 26px;
            font-size: 0.9em;

            .left-delete {
                display: flex;
                background-color: #fafafa;
                padding: 6px;
                border-radius: 5px;

                &:hover {
                    background-color: #eaeaea;
                    cursor: pointer;
                }
            }
        }

        .right {
            display: flex;

            .option {
                padding: 11px;
            }
        }

        .el-input {
            width: 200px;
            margin: 5px;
            height: 32px;
        }

        .el-button {
            padding-right: 10px;
        }
    }

    .main {
        position: absolute;
        top: 43px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        padding: 10px;

        .post {
            border-radius: 5px;
            border: #f2f2f2 solid 1px;
            padding: 10px;
            display: flex;
            font-size: 14px;

            &:hover {
                background-color: #fafafa;
                cursor: pointer;
            }

            .choose {
                width: 30px;

                .el-checkbox {
                    margin-top: 13px;
                }
            }

            .board {
                width: 100%;

                .title {
                    font-size: 1.5em;
                    line-height: 28px;
                }

                .description {
                    font-size: 0.7em;
                    display: flex;
                    margin-top: 15px;
                    color: #999999;
                    height: 20px;
                    line-height: 10px;

                    .status {
                        .badge {
                            display: inline-block;
                            height: 6px;
                            width: 6px;
                            border-radius: 3px;
                            margin: 0 4px;
                        }

                        .draft {
                            background-color: #909399;
                        }

                        .release {
                            background-color: #67C23A;
                        }

                        .recycle {
                            background-color: #F56C6C;
                        }
                    }

                    .update-time {
                        margin-left: 10px;

                        i {
                            margin: 0 4px;
                        }
                    }

                    .tag {
                        margin-left: 10px;

                        i {
                            margin: 0 4px;
                        }

                        .tag-item {
                            padding: 0 6px;
                            border-right: #999999 solid 1px;

                            &:last-child {
                                border-right: #ffffff;
                            }
                        }
                    }

                    .category {
                        margin-left: 10px;

                        i {
                            margin: 0 4px;
                        }

                        .category-item {
                            padding: 0 6px;
                            border-right: #999999 solid 1px;

                            &:last-child {
                                border-right: #ffffff;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>