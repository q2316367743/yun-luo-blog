<template>
    <div id="post">
        <header class="header">
            <div class="left">
                <el-input v-model="keyword" placeholder="搜索文章" class="input-with-select" @input="searchPost"
                          clearable>
                    <template #append>
                        <el-button :icon="search" @click="searchPost"/>
                    </template>
                </el-input>
                <el-select v-model="status" placeholder="状态" style="width: 100px;" @change="searchPost" clearable>
                    <el-option label="草稿" :value="1"/>
                    <el-option label="发布" :value="2"/>
                    <el-option label="回收站" :value="3"/>
                </el-select>
                <el-select v-model="type" placeholder="排序" style="width: 130px;margin-left: 5px" @change="searchPost"
                           clearable>
                    <el-option label="标题(a-z)" :value="1"/>
                    <el-option label="标题(z-a)" :value="2"/>
                    <el-option label="更新时间(新-旧)" :value="3"/>
                    <el-option label="更新时间(旧-新)" :value="4"/>
                    <el-option label="创建时间(新-旧)" :value="5"/>
                    <el-option label="创建时间(旧-新)" :value="6"/>
                </el-select>
            </div>
            <div class="right">
                <div class="option">
                    <el-button type="primary" link :icon="refresh" @click="refreshPost"></el-button>
                    <el-button type="primary" link :icon="plus" @click="toRouteLink('/post/new')"></el-button>
                </div>
            </div>
        </header>
        <main class="main">
            <el-scrollbar>
                <div v-for="(post, index) in showPosts" :key="index" class="post">
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
                                    <Calendar/>
                                </el-icon>
                                <span>{{ format(post.updated) }}</span>
                            </div>
                            <div class="tag" v-if="post.tags.length > 0">
                                <el-icon>
                                    <price-tag/>
                                </el-icon>
                                <span v-for="tag in post.tags" class="tag-item">{{ tag }}</span>
                            </div>
                            <div class="category" v-if="post.categories.length > 0">
                                <el-icon>
                                    <collection-tag/>
                                </el-icon>
                                <span v-for="category in post.categories" class="category-item">{{
                                        category
                                    }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="option">
                        <el-button type="primary" link @click="openSettingDialog(post.id)">设置</el-button>
                        <el-button type="danger" link @click="deleteById(post.id)">删除</el-button>
                    </div>
                </div>
                <el-empty v-if="showPosts.length === 0" description="暂无文章" style="margin-top: 110px;"/>
            </el-scrollbar>
        </main>
        <!-- 文章设置 -->
        <el-dialog v-model="settingDialog" draggable :close-on-click-modal="false">
            <template #header>
                <h2>文章设置</h2>
            </template>
            <el-tabs v-model="activeName">
                <el-tab-pane label="常规" name="basic">
                    <el-form v-model="post" label-position="top">
                        <el-form-item label="文章标题">
                            <el-input v-model="post.title"></el-input>
                        </el-form-item>
                        <el-form-item label="标签">
                            <el-select v-model="post.tags" multiple filterable allow-create default-first-option
                                       :reserve-keyword="false" style="width: 314px" placeholder="请选择标签">
                                <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.name"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分类">
                            <el-cascader v-model="post.categories" :options="categoryTree" :props="categoryProps"
                                         clearable placeholder="请选择分类"/>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="高级" name="senior">
                    <el-form v-model="post" label-position="top">
                        <el-form-item label="文章网址">
                            <el-input v-model="post.permalink"></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <el-date-picker v-model="post.date" type="datetime" :default-time="new Date()"/>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="post.status">
                                <el-option :value="1" label="草稿"/>
                                <el-option :value="2" label="发布"/>
                                <el-option :value="3" label="回收站"/>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="SEO" name="seo">Role</el-tab-pane>
                <el-tab-pane label="额外属性" name="extra">
                    <!-- 其他属性 -->
                    <div v-for="(item, index) in post.extra" :key="index" style="display: flex">
                        <el-input v-model="item.key" style="width: 50%;margin: 5px;">
                            <template #prepend>K</template>
                        </el-input>
                        <el-input v-model="item.value" style="width: 50%;margin: 5px;">
                            <template #prepend>V</template>
                            <template #append>
                                <el-button :icon="close" @click="extraRemove(item.id)"></el-button>
                            </template>
                        </el-input>
                    </div>
                    <el-button type="primary" @click="extraAdd">新增</el-button>
                </el-tab-pane>
            </el-tabs>
            <template #footer>
                <el-button @click="settingDialog = false">取消</el-button>
                <el-button type="primary" @click="settingSave">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Calendar, CollectionTag, Delete, Plus, PriceTag, Refresh, Search, Close} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from "element-plus";

import PostView from '@/views/PostView';
import DateUtil from '@/utils/DateUtil';
import {categoryService, postService, tagService} from '@/global/BeanFactory';
import Entry from "@/global/Entry";
import TagView from "@/views/TagView";
import CategoryView from "@/views/CategoryView";
import {parsePost} from "@/utils/PostUtil";

export default defineComponent({
    name: 'post',
    components: {Calendar, PriceTag, CollectionTag, Delete},
    setup() {
        const search = markRaw(Search);
        const plus = markRaw(Plus);
        const refresh = markRaw(Refresh);
        const close = markRaw(Close);
        return {search, plus, refresh, close}
    },
    data: () => ({
        keyword: '',
        posts: new Array<PostView>(),
        showPosts: new Array<PostView>(),
        status: null,
        type: 1,
        page: {
            number: 1,
            size: 10,
            total: 0
        },
        post: {
            id: 0,
            title: '新文章',
            fileName: '',
            path: '',
            status: 1,
            date: new Date(),
            updated: new Date(),
            comments: false,
            tags: [],
            categories: [],
            permalink: "",
            excerpt: "",
            disableNunjucks: "",
            lang: "",
            extra: new Array<Entry>(),
            content: ''
        } as PostView,
        settingDialog: false,
        activeName: "basic",
        categoryProps: {
            checkStrictly: true,
            value: 'name',
            label: 'name'
        },
        tags: new Array<TagView>(),
        categoryTree: new Array<CategoryView>()
    }),
    created() {
        postService.list().then(posts => {
            this.posts = posts;
            this.searchPost();
        });
    },
    methods: {
        format: DateUtil.formatDateTime,
        searchPost() {
            this.showPosts = this.posts.filter(e => this.keyword == '' || e.title.indexOf(this.keyword) > -1)
                .filter(e => !this.status || this.status === 0 || e.status === this.status)
                .sort((e1, e2) => {
                    if (this.type === 1) {
                        return e1.title.localeCompare(e2.title);
                    } else if (this.type === 2) {
                        return e2.title.localeCompare(e1.title);
                    } else if (this.type === 3) {
                        return new Date(e2.updated).getTime() - new Date(e1.updated).getTime()
                    } else if (this.type === 4) {
                        return new Date(e1.updated).getTime() - new Date(e2.updated).getTime()
                    } else if (this.type === 5) {
                        return new Date(e2.date).getTime() - new Date(e1.date).getTime()
                    } else if (this.type === 6) {
                        return new Date(e1.date).getTime() - new Date(e2.date).getTime()
                    } else {
                        // 默认标题正序
                        return e1.title.localeCompare(e2.title);
                    }
                });
        },
        toRouteLink(link: string) {
            this.$router.push(link);
        },
        toPostInfo(postView: PostView) {
            this.$router.push({
                path: '/post/new',
                query: {
                    id: postView.id
                }
            });
        },
        refreshPost() {
            // 强制刷新
            postService.refresh().then(() => {
                postService.list().then(posts => {
                    this.posts = posts;
                    this.searchPost();
                })
            })
        },
        deleteById(id?: number) {
            ElMessageBox.confirm(
                '确定删除此文章，删除后将无法恢复',
                '警告',
                {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                // 先删除路径
                postService.deleteById(id!).then(() => {
                    // 删除成功，准备删除源文件
                    ElMessage({
                        type: 'success',
                        message: '删除成功',
                    });

                    postService.list().then(posts => {
                        this.posts = posts;
                        this.searchPost();
                    })
                }).catch((e) => {
                    ElMessage({
                        type: 'error',
                        message: '删除失败，' + e,
                    })
                });
            }).catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消删除',
                })
            })
        },
        openSettingDialog(id?: number) {
            // 获取数据
            tagService.list().then(tags => {
                this.tags = tags;
            })
            categoryService.list().then((categoryTree: Array<CategoryView>) => {
                this.categoryTree = categoryTree;
            })
            postService.info(id!).then(post => {
                if (post) {
                    // 存在文章，查询文章详情
                    parsePost(post.path, post.fileName, true).then(post => {
                        this.post = post!;
                        // 重新对post.id赋值
                        this.post.id = id;
                    });
                } else {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '文章不存在，请刷新后重试'
                    });
                    this.$router.push('/post/list');
                }
            });
            // 打开设置弹窗
            this.settingDialog = true;
        },
        extraAdd() {
            this.post.extra.push({
                id: new Date().getTime(),
                key: "",
                value: ""
            })
        },
        extraRemove(id: number) {
            this.post.extra = this.post.extra.filter(e => e.id !== id);
        },
        settingSave() {
            postService.update(this.post).then(() => {
                this.settingDialog = false;
                postService.list().then(posts => {
                    this.posts = posts;
                    this.searchPost();
                });
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: '保存成功'
                });
                // 更新列表
            }).catch(e => {
                this.settingDialog = false;
                console.error(e);
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '保存失败，' + e
                });
            });
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
            font-size: 0.9em;

        }

        .right {
            display: flex;

            .option {
                padding: 11px;

                .el-button {
                    padding-right: 10px;
                }
            }
        }

        .el-input {
            width: 200px;
            margin: 5px;
            height: 32px;
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

            .board {
                width: 100%;

                .title {
                    font-size: 1.5em;
                    line-height: 28px;
                }

                .description {
                    font-size: 1em;
                    display: flex;
                    margin-top: 15px;
                    color: #999999;
                    height: 20px;

                    .el-icon {
                        vertical-align: -2px;
                    }

                    .status {
                        .badge {
                            display: inline-block;
                            height: 6px;
                            width: 6px;
                            border-radius: 3px;
                            margin: 0 4px 2px;
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