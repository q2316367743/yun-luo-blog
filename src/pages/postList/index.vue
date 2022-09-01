<template>
    <container-header class="header">
        <el-input v-model="keyword" :placeholder="$t('post.list.searchPost')" class="input-with-select"
                  @input="searchPost" clearable>
            <template #append>
                <el-button :icon="search" @click="searchPost"/>
            </template>
        </el-input>
        <el-select v-model="status" :placeholder="$t('common.status')" style="width: 100px;" @change="searchPost"
                   clearable>
            <el-option :label="$t('post.list.draft')" :value="1"/>
            <el-option :label="$t('post.list.release')" :value="2"/>
            <el-option :label="$t('post.list.recycle')" :value="3"/>
        </el-select>
        <el-select v-model="type" :placeholder="$t('common.sort')" style="width: 130px;margin-left: 5px"
                   @change="searchPost" clearable>
            <el-option :label="$t('post.list.sortTitleAsc')" :value="1"/>
            <el-option :label="$t('post.list.sortTitleDesc')" :value="2"/>
            <el-option :label="$t('post.list.sortUpdateAsc')" :value="3"/>
            <el-option :label="$t('post.list.sortUpdateDesc')" :value="4"/>
            <el-option :label="$t('post.list.sortCreateAsc')" :value="5"/>
            <el-option :label="$t('post.list.sortCreateDesc')" :value="6"/>
        </el-select>
        <el-dropdown split-button type="primary" @click="toRouteLink('')" @command="toRouteLink"
                     style="margin-top: 5px;">
            {{ $t('common.add') }}
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="layout">{{ $t('common.add_by_layout') }}</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </container-header>
    <container-main class="main">
        <div class="side" :style="{width: showSide ? '200px' : '18px'}" @click="clearSide();searchPost();">
            <div class="side-view" :style="{width: showSide ? '182px' : '0px'}">
                <div class="side-option">
                    <el-button-group>
                        <el-button :type="activeName === 'category' ? 'primary' : 'default'"
                                   @click="switchActiveName('category')"
                                   :disabled="activeName === 'category'">分类
                        </el-button>
                        <el-button :type="activeName === 'tag' ? 'primary' : 'default'" @click="switchActiveName('tag')"
                                   :disabled="activeName === 'tag'">标签
                        </el-button>
                    </el-button-group>
                </div>
                <div class="side-list">
                    <el-scrollbar>
                        <el-tree :data="categoryTree" :props="categoryProps" default-expand-all
                                 @node-click="categoryClick" v-show="activeName === 'category'"/>

                        <el-checkbox-group v-model="tags" v-show="activeName === 'tag'" @change="tagChange">
                            <el-checkbox v-for="tag in tagList" :label="tag" style="display: block;" @click.stop/>
                        </el-checkbox-group>
                    </el-scrollbar>
                </div>
            </div>
            <div class="side-switch" @click.stop="showSide = !showSide">
                <el-icon :size="12">
                    <arrow-left-bold v-if="showSide"/>
                    <arrow-right-bold v-else/>
                </el-icon>
            </div>
        </div>
        <div class="post-view">
            <el-scrollbar>
                <post-list-item v-for="(post, index) in showPosts" :key="index" :post="post"
                                @item-click="toPostInfo(post)" @option-info="openSettingDialog(post.id)"
                                @option-remove="deleteById(post.id)">
                </post-list-item>
                <el-empty v-if="showPosts.length === 0" description="暂无文章" style="margin-top: 110px;"/>
            </el-scrollbar>
        </div>
    </container-main>
    <!-- 文章设置 -->
    <el-dialog v-model="settingDialog" draggable :close-on-click-modal="false" top="9vh">
        <template #header>
            <h2>{{ $t('post.list.postSetting') }}</h2>
        </template>
        <post-setting :post-view="post" ref="postSetting"/>
        <template #footer>
            <el-button @click="settingDialog = false">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="settingSave">{{ $t('common.save') }}</el-button>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {
    ArrowLeftBold,
    ArrowRightBold,
    Calendar,
    Close,
    CollectionTag,
    Delete,
    Plus,
    PriceTag,
    Refresh,
    Search
} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from "element-plus";

import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";

import PostView from '@/views/PostView';
import {categoryService, postService, settingService, tagService} from '@/global/BeanFactory';
import CategoryView from "@/views/CategoryView";
import PostListItem from "@/components/PostListItem/index.vue";
import PostSetting from "@/pages/postSetting/index.vue";
import PostSettingPage from "@/pages/postSetting/index";
import ArrayUtil from "@/utils/ArrayUtil";

export default defineComponent({
    name: 'post-list',
    components: {
        PostSetting, PostListItem, ContainerMain, ContainerHeader,
        Calendar, PriceTag, CollectionTag, Delete, ArrowLeftBold, ArrowRightBold
    },
    setup() {
        const search = markRaw(Search);
        const plus = markRaw(Plus);
        const refresh = markRaw(Refresh);
        const close = markRaw(Close);
        return {search, plus, refresh, close}
    },
    data: () => ({
        posts: new Array<PostView>(),
        showPosts: new Array<PostView>(),
        keyword: '',
        status: null,
        type: 1,
        category: '',
        tags: new Array<string>(),
        page: {
            number: 1,
            size: 10,
            total: 0
        },
        post: {} as PostView,
        settingDialog: false,
        activeName: 'category',
        showSide: false,
        categoryProps: {
            checkStrictly: true,
            value: 'name',
            label: 'name'
        },
        categoryTree: new Array<CategoryView>(),
        tagList: new Array<string>()
    }),
    created() {
        this.showSide = settingService.getBasic().showSide;
        this.init();
    },
    methods: {
        init() {
            postService.list().then(posts => {
                this.posts = posts;
                this.searchPost();
            });
            categoryService.list().then(categoryTree => {
                this.categoryTree = categoryTree;
            });
            tagService.list().then((tags) => {
                this.tagList = tags.map(e => e.name);
            });
        },
        searchPost() {
            this.showPosts = this.posts
                .filter(e => this.keyword === '' || e.title.indexOf(this.keyword) > -1)
                .filter(e => !this.status || this.status === 0 || e.status === this.status)
                .filter(e => this.category === '' || ArrayUtil.contains(e.categories, this.category))
                .filter(e => this.tags.length === 0 || ArrayUtil.containsArray(this.tags, e.tags))
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
        async toRouteLink(command: string) {
            try {
                let layout;
                if (command === 'layout') {
                    const layoutPrompt: { value: string } = await ElMessageBox.prompt('请输入文章布局名称', '新建文章', {
                        type: 'info',
                        confirmButtonText: this.$t('common.add'),
                        cancelButtonText: this.$t('common.cancel'),
                    });
                    layout = layoutPrompt.value;
                }
                this.$router.push({
                    path: '/post/edit',
                    query: {
                        source: 1,
                        layout: layout
                    }
                });
            } catch (e) {
                console.log('取消跳转')
            }
        },
        toPostInfo(postView: PostView) {
            this.$router.push({
                path: '/post/edit',
                query: {
                    id: postView.id,
                    source: 1,
                }
            });
        },
        deleteById(id?: number) {
            ElMessageBox.confirm(
                this.$t('post.list.deletePostHint'),
                this.$t('common.warning'),
                {
                    confirmButtonText: this.$t('common.delete'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning',
                }
            ).then(() => {
                // 先删除路径
                postService.deleteById(id!).then(() => {
                    // 删除成功，准备删除源文件
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: this.$t('hint.delete_success'),
                    });
                    this.init();
                }).catch((e) => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: this.$t('hint.delete_fail') + ',' + e,
                    })
                });
            }).catch(() => {
                ElMessage({
                    showClose: true,
                    type: 'info',
                    message: this.$t('hint.delete_cancel'),
                })
            });
        },
        openSettingDialog(id?: number) {
            postService.info(id!).then(post => {
                if (post) {
                    this.post = post;
                    // 打开设置弹窗
                    this.settingDialog = true;
                    this.$nextTick(() => {
                        let postSetting = this.$refs.postSetting as PostSettingPage;
                        postSetting.setView(post);
                    })
                } else {
                    ElMessage({
                        showClose: false,
                        type: 'error',
                        message: '文章未找到'
                    })
                }
            })
        },
        settingSave() {
            let postSetting = this.$refs.postSetting as PostSettingPage
            postService.update(postSetting.getView()).then(() => {
                this.settingDialog = false;
                this.init();
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: this.$t('hint.save_success')
                });
                // 更新列表
            }).catch(e => {
                this.settingDialog = false;
                console.error(e);
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: this.$t('hint.save_fail') + "," + e
                });
            });
        },
        categoryClick(data: CategoryView) {
            this.clearSide();
            this.category = data.name;
            this.searchPost();
        },
        tagChange() {
            this.searchPost();
        },
        switchActiveName(name: string) {
            this.clearSide();
            this.activeName = name;
        },
        clearSide() {
            this.category = '';
            this.tags = new Array<string>();
        }
    }
});
</script>
<style lang="less" scoped>
.header {
    display: flex;

    font-size: 0.9em;

    .el-input {
        width: 200px;
        margin: 5px;
        height: 32px;
    }

    .el-select {
        margin: 5px;
        height: 32px;
    }
}

.main {
    overflow: auto;
    display: flex;

    .side {
        height: 100%;
        display: flex;
        position: relative;
        transition: 0.3s width ease-in-out;
        overflow: hidden;

        .side-view {
            padding: 8px;
            overflow: hidden;
            transition: 0.3s width ease-in-out;

            .side-option {
                width: 140px;
                text-align: center;
            }

            .side-list {
                margin-top: 8px;
                height: calc(100% - 40px);
            }

        }

        .side-switch {
            width: 12px;
            height: 56px;
            background-color: #e3e9ed;
            position: absolute;
            right: 3px;
            top: 40%;
            line-height: 56px;
            text-align: center;
            cursor: pointer;
            z-index: 1;

            &:hover {
                background-color: #ebf0f2;
            }
        }

    }

    .post-view {
        height: 100%;
        width: 100%;
        margin-right: 9px;
    }
}
</style>