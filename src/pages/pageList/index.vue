<template>
    <container-header class="header">
        <el-input v-model="keyword" :placeholder="$t('post.list.searchPage')" class="input-with-select"
                  @input="searchPage" clearable>
            <template #append>
                <el-button :icon="search" @click="searchPage"/>
            </template>
        </el-input>
        <el-select v-model="status" :placeholder="$t('common.status')" style="width: 100px;" @change="searchPage"
                   clearable>
            <el-option :label="$t('post.list.draft')" :value="1"/>
            <el-option :label="$t('post.list.release')" :value="2"/>
            <el-option :label="$t('post.list.recycle')" :value="3"/>
        </el-select>
        <el-select v-model="type" :placeholder="$t('common.sort')" style="width: 130px;margin-left: 5px"
                   @change="searchPage" clearable>
            <el-option :label="$t('post.list.sortTitleAsc')" :value="1"/>
            <el-option :label="$t('post.list.sortTitleDesc')" :value="2"/>
            <el-option :label="$t('post.list.sortUpdateAsc')" :value="3"/>
            <el-option :label="$t('post.list.sortUpdateDesc')" :value="4"/>
            <el-option :label="$t('post.list.sortCreateAsc')" :value="5"/>
            <el-option :label="$t('post.list.sortCreateDesc')" :value="6"/>
        </el-select>
        <el-dropdown split-button type="primary" @click="openAddDialog('')" @command="openAddDialog"
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
        <el-scrollbar v-if="pages.length > 0">
            <post-list-item v-for="page in showPages" :key="page.id" :post="page" @item-click="editPage(page.id)"
                            @option-info="openPageSettingDialog(page.id)"
                            @option-remove="deletePageById(page.id)"></post-list-item>
        </el-scrollbar>
        <el-empty v-else description="暂无页面" style="margin-top: 15vh"/>
    </container-main>
    <!-- 文章设置 -->
    <el-dialog v-model="settingDialog" draggable :close-on-click-modal="false" top="9vh">
        <template #header>
            <h2>{{ $t('post.list.postSetting') }}</h2>
        </template>
        <post-setting :post-view="post" ref="postSetting"></post-setting>
        <template #footer>
            <el-button @click="settingDialog = false">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="settingSave">{{ $t('common.save') }}</el-button>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Close, Search} from '@element-plus/icons-vue';
import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";
import PostListItem from "@/components/PostListItem/index.vue";
import PostView from "@/views/PostView";
import {pageService} from "@/global/BeanFactory";
import {ElMessage, ElMessageBox} from "element-plus";
import TagView from "@/views/TagView";
import CategoryView from "@/views/CategoryView";
import PostSetting from "@/pages/postSetting/index.vue";
import PostSettingPage from "@/pages/postSetting/index";

export default defineComponent({
    name: 'page-list',
    components: {PostSetting, PostListItem, ContainerMain, ContainerHeader},
    data: () => ({
        search: markRaw(Search),
        close: markRaw(Close),
        keyword: '',
        status: null,
        type: 1,
        showPages: new Array<PostView>(),
        pages: new Array<PostView>(),
        post: {} as PostView,
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
        this.listPage();
    },
    methods: {
        listPage() {
            pageService.list().then(pages => {
                this.pages = pages;
                this.searchPage();
            })
        },
        searchPage() {
            this.showPages = this.pages.filter(e => this.keyword == '' || e.title.indexOf(this.keyword) > -1)
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
        async openAddDialog(command: string) {
            try {
                let layout;
                if (command === 'layout') {
                    const layoutPrompt: { value: string } = await ElMessageBox.prompt('请输入页面布局名称', '新建页面', {
                        type: 'info',
                        confirmButtonText: '继续',
                        cancelButtonText: '取消',
                    });
                    layout = layoutPrompt.value;
                }
                const {value} = await ElMessageBox.prompt('请输入页面链接地址，不能包含特殊符号', '新建页面', {
                    type: 'info',
                    confirmButtonText: '新建',
                    cancelButtonText: '取消',
                    inputPattern: /^(?:\/?)?((|[\w-]+\.)+[a-zA-Z0-9\u4e00-\u9fa5]+)(?:(\/[^/?#]+)*)?(\?[^#]+)?(#.+)?(?:\/?)?$/,
                    inputErrorMessage: '请输入正确的页面链接地址'
                });
                this.$router.push({
                    path: '/page/edit',
                    query: {
                        source: 2,
                        permalink: value,
                        layout: layout
                    }
                });
            } catch (e) {
                console.log('取消新增')
            }
        },
        editPage(id?: number) {
            this.$router.push({
                path: '/page/edit',
                query: {
                    id: id,
                    source: 2
                }
            });
        },
        deletePageById(id?: number) {
            ElMessageBox.confirm(
                this.$t('post.list.deletePageHint'),
                this.$t('common.warning'),
                {
                    confirmButtonText: this.$t('common.delete'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning',
                }
            ).then(() => {
                // 先删除路径
                pageService.deleteById(id!).then(() => {
                    // 删除成功，准备删除源文件
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: this.$t('hint.delete_success'),
                    });
                    this.listPage();
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
        openPageSettingDialog(id?: number) {
            pageService.info(id!).then(post => {
                if (post) {
                    this.post = post;
                    // 打开设置弹窗
                    this.settingDialog = true;
                    this.$nextTick(() => {
                        let postSetting = this.$refs.postSetting as PostSettingPage;
                        postSetting.setView(post);
                    })
                }else  {
                    ElMessage({
                        showClose: false,
                        type: 'error',
                        message: '页面未找到'
                    })
                }
            })
        },
        settingSave() {
            let postSetting = this.$refs.postSetting as PostSettingPage;
            pageService.update(postSetting.getView()).then(() => {
                this.settingDialog = false;
                this.listPage();
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
<style scoped lang="less">

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