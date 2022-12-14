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
                                   :disabled="activeName === 'category'">??????
                        </el-button>
                        <el-button :type="activeName === 'tag' ? 'primary' : 'default'" @click="switchActiveName('tag')"
                                   :disabled="activeName === 'tag'">??????
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
                <el-empty v-if="showPosts.length === 0" description="????????????" style="margin-top: 110px;"/>
            </el-scrollbar>
        </div>
    </container-main>
    <!-- ???????????? -->
    <post-setting v-model="settingDialog" :post-id="postId" ref="postSetting"/>
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

import PostListView from '@/views/PostListView';
import CategoryView from "@/views/CategoryView";

import PostListItem from "@/components/PostListItem/index.vue";

import PostSetting from "@/pages/postSetting/index.vue";

import ArrayUtil from "@/utils/ArrayUtil";

// ????????????API
import PostApi from "@/api/PostApi";
import CategoryApi from "@/api/CategoryApi";
import TagApi from "@/api/TagApi";

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
        posts: new Array<PostListView>(),
        showPosts: new Array<PostListView>(),
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
        postId: 0,
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
        // TODO: ??????????????????
        this.showSide = false;
        this.init();
    },
    methods: {
        init() {
            PostApi.list().then(posts => {
                this.posts = posts;
                this.searchPost();
            });
            CategoryApi.list().then(categoryTree => {
                this.categoryTree = categoryTree;
            });
            TagApi.list().then((tags) => {
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
                        // ??????????????????
                        return e1.title.localeCompare(e2.title);
                    }
                });
        },
        async toRouteLink(command: string) {
            try {
                let layout;
                if (command === 'layout') {
                    const layoutPrompt: { value: string } = await ElMessageBox.prompt('???????????????????????????', '????????????', {
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
                console.log('????????????')
            }
        },
        toPostInfo(postView: PostListView) {
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
                // ???????????????
                PostApi.deleteById(id!).then(() => {
                    // ????????????????????????????????????
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
            this.postId = id!;
            // ??????????????????
            this.settingDialog = true;
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