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
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('post.list.basic')" name="basic">
                <el-form v-model="page" label-position="top">
                    <el-form-item :label="$t('post.list.postTitle')">
                        <el-input v-model="page.title"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('menu.tag')">
                        <el-select v-model="page.tags" multiple filterable allow-create default-first-option
                                   :reserve-keyword="false" style="width: 314px" :placeholder="$t('placeholder.tag')">
                            <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.name"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('menu.category')">
                        <el-cascader v-model="page.categories" :options="categoryTree" :props="categoryProps"
                                     clearable :placeholder="$t('placeholder.category')"/>
                    </el-form-item>
                    <el-form-item :label="$t('common.status')">
                        <el-select v-model="page.status">
                            <el-option :value="1" :label="$t('post.list.draft')"/>
                            <el-option :value="2" :label="$t('post.list.release')"/>
                            <el-option :value="3" :label="$t('post.list.recycle')"/>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane :label="$t('post.list.senior')" name="senior">
                <el-form v-model="page" label-position="top">
                    <el-form-item :label="$t('post.list.postUrl')">
                        <el-input v-model="page.permalink"></el-input>
                    </el-form-item>
                    <el-form-item label="布局">
                        <el-input v-model="page.layout" placeholder="请输入布局"/>
                    </el-form-item>
                    <el-form-item :label="$t('post.list.createTime')">
                        <el-date-picker v-model="page.date" type="datetime" :default-time="new Date()"/>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane :label="$t('post.list.extraAttr')" name="extra">
                <!-- 其他属性 -->
                <div v-for="(item, index) in page.extra" :key="index" style="display: flex">
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
                <el-button type="primary" @click="extraAdd">{{ $t('common.add') }}</el-button>
            </el-tab-pane>
        </el-tabs>
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
import {categoryService, pageService, tagService} from "@/global/BeanFactory";
import {ElMessage, ElMessageBox} from "element-plus";
import Entry from "@/global/Entry";
import TagView from "@/views/TagView";
import CategoryView from "@/views/CategoryView";
import {parsePost} from "@/utils/PostUtil";

export default defineComponent({
    name: 'page-list',
    components: {PostListItem, ContainerMain, ContainerHeader},
    data: () => ({
        search: markRaw(Search),
        close: markRaw(Close),
        keyword: '',
        status: null,
        type: 1,
        showPages: new Array<PostView>(),
        pages: new Array<PostView>(),
        page: {
            id: 0,
            title: '',
            fileName: '',
            path: '',
            layout: '',
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
                    inputPattern: /^(?:\/?)?((|[\w-]+\.)+[a-z0-9]+)(?:(\/[^/?#]+)*)?(\?[^#]+)?(#.+)?(?:\/?)?$/,
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
                        type: 'success',
                        message: this.$t('hint.delete_success'),
                    });
                    this.listPage();
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
        openPageSettingDialog(id?: number) {
            // 获取数据
            tagService.list().then(tags => {
                this.tags = tags;
            })
            categoryService.list().then((categoryTree: Array<CategoryView>) => {
                this.categoryTree = categoryTree;
            })
            pageService.info(id!).then(post => {
                if (post) {
                    // 存在文章，查询文章详情
                    parsePost(pageService.getBasePath(), post.fileName, true).then(renderPost => {
                        this.page = renderPost!;
                        // 重新对post.id赋值
                        this.page.id = id;
                    });
                } else {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: this.$t('post.list.notPostHint')
                    });
                    this.$router.push('/post/list');
                }
            });
            // 打开设置弹窗
            this.settingDialog = true;
        },
        extraAdd() {
            this.page.extra.push({
                id: new Date().getTime(),
                key: "",
                value: ""
            })
        },
        extraRemove(id: number) {
            this.page.extra = this.page.extra.filter(e => e.id !== id);
        },
        settingSave() {
            pageService.update(this.page).then(() => {
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