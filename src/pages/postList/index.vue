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
        <el-scrollbar>
            <post-list-item v-for="(post, index) in showPosts" :key="index" :post="post"
                            @item-click="toPostInfo(post)" @option-info="openSettingDialog(post.id)"
                            @option-remove="deleteById(post.id)">
            </post-list-item>
            <el-empty v-if="showPosts.length === 0" description="暂无文章" style="margin-top: 110px;"/>
        </el-scrollbar>
    </container-main>
    <!-- 文章设置 -->
    <el-dialog v-model="settingDialog" draggable :close-on-click-modal="false" top="9vh">
        <template #header>
            <h2>{{ $t('post.list.postSetting') }}</h2>
        </template>
        <post-setting :post-id="postId" ref="postSetting" />
        <template #footer>
            <el-button @click="settingDialog = false">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="settingSave">{{ $t('common.save') }}</el-button>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Calendar, Close, CollectionTag, Delete, Plus, PriceTag, Refresh, Search} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from "element-plus";

import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";

import PostView from '@/views/PostView';
import {postService} from '@/global/BeanFactory';
import TagView from "@/views/TagView";
import CategoryView from "@/views/CategoryView";
import PostListItem from "@/components/PostListItem/index.vue";
import PostSetting from "@/pages/postSetting/index.vue";
import PostSettingPage from "@/pages/postSetting/index";

export default defineComponent({
    name: 'post-list',
    components: {PostSetting, PostListItem, ContainerMain, ContainerHeader, Calendar, PriceTag, CollectionTag, Delete},
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
        postId: 0,
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
                        type: 'success',
                        message: this.$t('hint.delete_success'),
                    });

                    postService.list().then(posts => {
                        this.posts = posts;
                        this.searchPost();
                    })
                }).catch((e) => {
                    ElMessage({
                        type: 'error',
                        message: this.$t('hint.delete_fail') + ',' + e,
                    })
                });
            }).catch(() => {
                ElMessage({
                    type: 'info',
                    message: this.$t('hint.delete_cancel'),
                })
            });
        },
        openSettingDialog(id?: number) {
            this.postId = id!;
            // 打开设置弹窗
            this.settingDialog = true;
        },
        settingSave() {
            let postSetting = this.$refs.postSetting as PostSettingPage
            postService.update(postSetting.getView()).then(() => {
                this.settingDialog = false;
                postService.list().then(posts => {
                    this.posts = posts;
                    this.searchPost();
                });
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
    padding: 10px;
}
</style>