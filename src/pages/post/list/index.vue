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
                    <el-button type="primary" link :icon="refresh" @click="refreshPost"></el-button>
                    <el-button type="primary" link :icon="plus" @click="toRouteLink('/post/new')"></el-button>
                </div>
            </div>
        </header>
        <main class="main">
            <el-scrollbar>
                <el-checkbox-group v-model="deletePostPath" v-if="showPosts.length > 0">
                    <div v-for="(post, index) in showPosts" :key="index" class="post">
                        <div class="choose">
                            <el-checkbox :label="post.path"><br /></el-checkbox>
                        </div>
                        <div class="board" @click="toPostInfo(post)">
                            <div class="title">{{ post.title }}</div>
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
                                    <span>{{ format(post.updated) }}</span>
                                </div>
                                <div class="tag" v-if="post.tags.length > 0">
                                    <el-icon>
                                        <price-tag />
                                    </el-icon>
                                    <span v-for="tag in post.tags" class="tag-item">{{ tag }}</span>
                                </div>
                                <div class="category" v-if="post.categories.length > 0">
                                    <el-icon>
                                        <collection-tag />
                                    </el-icon>
                                    <span v-for="category in post.categories" class="category-item">{{ category
                                    }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="option">
                            <el-button type="danger" link @click="deleteByPath(post.path)">删除</el-button>
                        </div>
                    </div>
                </el-checkbox-group>
                <el-empty v-else description="暂无文章" style="margin-top: 110px;" />
            </el-scrollbar>
        </main>
    </div>
</template>
<script lang="ts">
import { defineComponent, markRaw } from "vue";
import { Search, Plus, Refresh, Calendar, PriceTag, CollectionTag, Delete } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from "element-plus";

import { usePostStore } from '@/store/PostStore';
import { Post } from '@/types/Post';
import DateUtil from '@/utils/DateUtil';
import { deleteByPath } from '@/utils/PostUtil'

export default defineComponent({
    name: 'post',
    components: { Calendar, PriceTag, CollectionTag, Delete },
    setup() {
        const search = markRaw(Search);
        const plus = markRaw(Plus);
        const refresh = markRaw(Refresh);
        const postStore = usePostStore();
        let posts = postStore.posts;
        return { search, plus, refresh, posts }
    },
    data: () => ({
        keyword: '',
        showSearch: false,
        showPosts: new Array<Post>(),
        deletePostPath: new Array<string>(),
        page: {
            number: 1,
            size: 10,
            total: 0
        }
    }),
    created() {
        usePostStore().append().then(rsp => {
            if (rsp) {
                // 如果存在新增的文章，就刷新
                this.posts = new Array<Post>();
                this.showPosts = new Array<Post>();
                usePostStore().list.forEach(p => {
                    this.posts.push(p);
                    this.showPosts.push(p);
                });
            }
        });
        this.searchPost();
    },
    methods: {
        format: DateUtil.formatDateTime,
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
                if (post.title.indexOf(this.keyword) > -1) {
                    this.showPosts.push(post);
                }
            })
        },
        toRouteLink(link: string) {
            this.$router.push(link);
        },
        toPostInfo(post: Post) {
            this.$router.push({
                path: '/post/new',
                query: {
                    title: post.title,
                    path: post.path,
                    fileName: post.fileName
                }
            });
        },
        refreshPost() {
            // 强制刷新
            usePostStore().refresh().then(rsp => {
                if (rsp) {
                    // 如果存在新增的文章，就刷新
                    this.posts = new Array<Post>();
                    this.showPosts = new Array<Post>();
                    usePostStore().list.forEach(p => {
                        this.posts.push(p);
                        this.showPosts.push(p);
                    });
                }
            });
            this.searchPost();
        },
        deleteByPath(path: string) {
            ElMessageBox.confirm(
                '确定删除此文章，删除后将无法恢复',
                '警告',
                {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
                .then(() => {
                    // 先删除路径
                    usePostStore().deleteByPath(path).then(post => {
                        // 删除成功，准备删除源文件
                        deleteByPath(path).then(() => {
                            ElMessage({
                                type: 'success',
                                message: '删除成功',
                            });
                            this.searchPost();
                        }).catch((e) => {
                            ElMessage({
                                type: 'error',
                                message: '删除失败，' + e,
                            });
                            // 将删除的文章索引加回去
                            usePostStore().add(post);
                        })
                    })
                })
                .catch(() => {
                    ElMessage({
                        type: 'info',
                        message: '取消删除',
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
            margin-top: 10px;
            position: relative;

            &:hover {
                background-color: #fafafa;
                cursor: pointer;

                .option {
                    display: block;
                }
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

            .option {
                position: absolute;
                right: 42px;
                top: 32px;
                display: none;
            }
        }
    }
}
</style>