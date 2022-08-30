<template>
    <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('post.list.basic')" name="basic">
            <el-form v-model="post" label-position="top">
                <el-form-item :label="$t('post.list.postTitle')">
                    <el-input v-model="post.title"></el-input>
                </el-form-item>
                <el-form-item :label="$t('menu.tag')">
                    <el-select v-model="post.tags" multiple filterable allow-create default-first-option
                               :reserve-keyword="false" style="width: 314px" :placeholder="$t('placeholder.tag')">
                        <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.name"/>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('menu.category')">
                    <el-cascader v-model="post.categories" :options="categoryTree" :props="categoryProps"
                                 clearable :placeholder="$t('placeholder.category')"/>
                </el-form-item>
                <el-form-item :label="$t('common.status')">
                    <el-select v-model="post.status">
                        <el-option :value="1" :label="$t('post.list.draft')"/>
                        <el-option :value="2" :label="$t('post.list.release')"/>
                        <el-option :value="3" :label="$t('post.list.recycle')"/>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('post.list.senior')" name="senior">
            <el-form v-model="post" label-position="top">
                <el-form-item :label="$t('post.list.postUrl')">
                    <el-input v-model="post.permalink"></el-input>
                </el-form-item>
                <el-form-item label="布局">
                    <el-input v-model="post.layout" placeholder="请输入布局"/>
                </el-form-item>
                <el-form-item :label="$t('post.list.createTime')">
                    <el-date-picker v-model="post.date" type="datetime" :default-time="new Date()"/>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('post.list.extraAttr')" name="extra">
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
            <el-button type="primary" @click="extraAdd">{{ $t('common.add') }}</el-button>
        </el-tab-pane>
        <el-tab-pane label="拓展" name="expand">
            <el-input type="textarea" :rows="5" v-model="post.expand"></el-input>
        </el-tab-pane>
    </el-tabs>
</template>
<script lang="ts">
import {defineComponent, PropType, markRaw} from "vue";
import Entry from "@/global/Entry";
import PostView from "@/views/PostView";
import TagView from "@/views/TagView";
import CategoryView from "@/views/CategoryView";
import {Close} from "@element-plus/icons-vue";
import {categoryService, tagService} from "@/global/BeanFactory";

export default defineComponent({
    name: 'post-setting',
    props: {
        postView: {
            type: Object as PropType<PostView>,
            required: false,
        }
    },
    data: () => ({
        activeName: "basic",
        post: {
            id: 0,
            title: '',
            fileName: '',
            path: '',
            status: 1,
            layout: '',
            date: new Date(),
            updated: new Date(),
            comments: false,
            tags: [],
            categories: [],
            permalink: "",
            excerpt: "",
            disableNunjucks: "",
            lang: "",
            type: '',
            extra: new Array<Entry>(),
            expand: '',
            content: ''
        } as PostView,
        categoryProps: {
            checkStrictly: true,
            value: 'name',
            label: 'name'
        },
        tags: new Array<TagView>(),
        categoryTree: new Array<CategoryView>(),
        close: markRaw(Close)
    }),
    created() {
        this.init();
    },
    watch: {
        postView() {
            this.init();
        }
    },
    methods: {
        init() {
            if (!this.postView) {
                return;
            }
            // 文章详情
            this.post = this.postView;
            // 标签
            tagService.list().then(tags => {
                this.tags = tags;
            })
            // 分类
            categoryService.list().then((categoryTree: Array<CategoryView>) => {
                this.categoryTree = categoryTree;
            })
        },
        extraAdd() {
            this.post.extra.push({
                id: new Date().getTime(),
                key: "",
                value: ""
            })
        },
        extraRemove(id: number) {
            console.log(this.post.extra, id)
            this.post.extra = this.post.extra.filter(e => e.id !== id);
        },
        getView() {
            return this.post;
        },
        setView(view: PostView) {
            this.post = view;
            console.log(this.post)
        }
    }
});
</script>
<style scoped>

</style>