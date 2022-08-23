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
        <el-button type="primary" @click="searchPage('/post/new')">{{ $t('common.add') }}</el-button>
    </container-header>
    <container-main class="main">
        <el-scrollbar v-if="pages.length > 0">
            <post-list-item v-for="page in showPages" :key="page.id" :post="page" @item-click="editPage(page.id)"
                            @option-info="openPageSettingDialog(page.id)"
                            @option-remove="deletePageById(page.id)"></post-list-item>
        </el-scrollbar>
        <el-empty v-else description="暂无页面" style="margin-top: 15vh"/>
    </container-main>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Search} from '@element-plus/icons-vue';
import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";
import PostListItem from "@/components/PostListItem/index.vue";
import PostView from "@/views/PostView";
import {pageService} from "@/global/BeanFactory";

export default defineComponent({
    name: '',
    components: {PostListItem, ContainerMain, ContainerHeader},
    data: () => ({
        search: markRaw(Search),
        keyword: '',
        status: null,
        type: 1,
        showPages: new Array<PostView>(),
        pages: new Array<PostView>()
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
        editPage(id: number) {

        },
        openPageSettingDialog(id: number) {

        },
        deletePageById(id: number) {

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