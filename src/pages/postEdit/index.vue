<template>
    <div id="new-post">
        <div class="header">
            <el-page-header title="列表" :content="post.title" @back="toRouteLink"/>
        </div>
        <!-- 页面内容 -->
        <div class="post-new-main">
            <div class="post-new-title">
                <el-input v-model="post.title" placeholder="Please input"/>
                <div class="option">
                    <el-dropdown class="promotion" split-button type="primary" @click="saveOrPublish" @command="saveOrPublishSwitch">
                        {{ flag ? '发布' : '保存' }}
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="saveOrPublish">保存并返回</el-dropdown-item>
                                <el-dropdown-item command="saveOrPublishForDraft">保存为草稿并返回</el-dropdown-item>
                                <el-dropdown-item command="saveOrPublishForRelease">保存为发布并返回</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="post-new-body">
                <markdown-editor v-model="post.content" ref="monacoEditor"></markdown-editor>
            </div>
            <div class="post-new-side">
                <el-popover placement="left" :width="150" trigger="click">
                    <template #reference>
                        <el-button link :icon="infoFilled"></el-button>
                    </template>
                    <div style="width: 100%;text-align: center;">
                        字数：{{ textLength }}
                    </div>
                </el-popover>
                <el-tooltip class="box-item" effect="light" content="插入图片" placement="left">
                    <el-button link :icon="pictureFilled" @click="insertImage"></el-button>
                </el-tooltip>
                <el-tooltip class="box-item" effect="light" :content="`${sourceType}设置`" placement="left">
                    <el-button link :icon="tools" @click="openSetting"></el-button>
                </el-tooltip>
                <el-tooltip class="box-item" effect="light" content="预览（具体以主题为准）" placement="left">
                    <el-button link :icon="starFilled" @click="openPreview"></el-button>
                </el-tooltip>
            </div>
        </div>
        <!-- 文章设置 -->
        <el-dialog v-model="settingDialog" draggable :close-on-click-modal="false">
            <template #header>
                <h2>{{ sourceType }}设置</h2>
            </template>
            <el-tabs v-model="activeName">
                <el-tab-pane label="常规" name="basic">
                    <el-form v-model="post" label-position="top">
                        <el-form-item :label="`${sourceType}网址`">
                            <el-input v-model="post.permalink"></el-input>
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
        </el-dialog>
        <!-- 文章预览 -->
        <el-drawer v-model="previewDialog" direction="rtl" size="800px">
            <template #header>
                <h2>{{ post.title }}（实际效果以配置主题为准）</h2>
            </template>
            <el-scrollbar>
                <div class="entry" ref="article" v-html="previewContent"></div>
            </el-scrollbar>
        </el-drawer>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {
    Check,
    Close,
    InfoFilled,
    MoreFilled,
    PictureFilled,
    Promotion,
    StarFilled,
    Tools
} from '@element-plus/icons-vue';
import highlight from 'highlight.js';
import 'highlight.js/styles/docco.css'
import * as monaco from 'monaco-editor';
import {ElLoading, ElMessage, ElMessageBox} from "element-plus";

import markdownIt from '@/plugins/markdownIt';

import PostView from "@/views/PostView";
import TagView from "@/views/TagView";
import {parsePost} from "@/utils/PostUtil";
import {categoryService, pageService, postService, tagService} from '@/global/BeanFactory';
import imageStrategyContext from "@/strategy/image/ImageStrategyContext";

import MarkdownEditor from '@/components/MarkdownEditor/index.vue'

import '@/less/post.css'
import Entry from "@/global/Entry";
import CategoryView from "@/views/CategoryView";
import PostStatusEnum from "@/enumeration/PostStatusEnum";
import Constant from "@/global/Constant";

export default defineComponent({
    name: 'post-edit',
    components: {MarkdownEditor},
    setup() {
        const check = markRaw(Check);
        const promotion = markRaw(Promotion);
        const infoFilled = markRaw(InfoFilled);
        const pictureFilled = markRaw(PictureFilled);
        const moreFilled = markRaw(MoreFilled);
        const tools = markRaw(Tools);
        const starFilled = markRaw(StarFilled);
        const close = markRaw(Close);
        return {check, promotion, infoFilled, pictureFilled, moreFilled, tools, starFilled, close}
    },
    data: () => ({
        // 来源，1：文章，2：页面
        source: 0,
        activeName: 'basic',
        post: {
            id: 0,
            title: '',
            fileName: '',
            path: '',
            status: PostStatusEnum.RELEASE,
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
        categoryProps: {
            checkStrictly: true,
            value: 'name',
            label: 'name'
        },
        textLength: 0,
        tags: new Array<TagView>(),
        settingDialog: false,
        previewDialog: false,
        previewContent: '',
        // true新增，false修改
        flag: true,
        categoryTree: new Array<CategoryView>()
    }),
    computed: {
        sourceType() {
            if (this.source === 1) {
                return "文章";
            } else if (this.source === 2) {
                return "页面"
            } else {
                return "";
            }
        },
        listPage() {
            if (this.source === 1) {
                return "/post/list";
            } else if (this.source === 2) {
                return "/page/list"
            } else {
                return "/post/list";
            }
        }
    },
    mounted() {
        if (!this.$route.query.source) {
            this.$router.push('/post/list');
            ElMessageBox.alert('异常，来源不存在');
            return
        }
        this.source = parseInt(this.$route.query.source as string);
        tagService.list().then(tags => {
            this.tags = tags;
        })
        categoryService.list().then((categoryTree: Array<CategoryView>) => {
            this.categoryTree = categoryTree;
        })
        if (this.$route.query.id) {
            let postId = parseInt(this.$route.query.id as string);
            if (this.source === 1) {
                this.postInfo(postId);
            } else if (this.source === 2) {
                this.pageInfo(postId);
            } else {
                this.$router.push('/post/list');
                ElMessageBox.alert('异常，来源不存在');
                return
            }
            this.flag = false;
        } else {
            // 新增文章
            this.flag = true;
            if (this.$route.query.permalink) {
                this.post.permalink = this.$route.query.permalink as string;
            }
            if (this.source === 1) {
                this.post.title = '新文章';
            } else if (this.source === 2) {
                this.post.title = this.post.permalink;
            }
        }
        document.onkeydown = (e) => {
            // 名字插入
            // let monacoEditor = this.$refs.monacoEditor as any;
            // let instance = monacoEditor.getInstance() as monaco.editor.IStandaloneCodeEditor;
            // 各种快捷键
            if (e.ctrlKey) {
                if (e.code == 'KeyS') {
                    this.saveOrPublish();
                } else if (e.code === 'KeyB') {
                    // 加粗
                } else if (e.code === 'KeyI') {
                    // 斜体
                } else if (e.code === 'KeyD') {
                    // 删除这一行
                } else if (e.code === 'KeyE') {
                    // 打开预览
                    this.openPreview();
                }
            }
        }
    },
    unmounted() {
        document.onkeydown = null;
    },
    methods: {
        postInfo(postId: number) {
            postService.info(postId).then(post => {
                if (post) {
                    // 存在文章，查询文章详情
                    parsePost(post.path, post.fileName, true).then(post => {
                        this.post = post!;
                        // 重新对post.id赋值
                        this.post.id = postId;
                    });
                } else {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: this.sourceType + '不存在，请刷新后重试'
                    });
                    this.$router.push('/post/list');
                }
            });
        },
        pageInfo(postId: number) {
            pageService.info(postId).then(page => {
                if (page) {
                    // 存在文章，查询文章详情
                    parsePost(page.path, page.fileName, true).then(post => {
                        this.post = post!;
                        // 重新对post.id赋值
                        this.post.id = postId;
                    });
                } else {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '页面不存在，请刷新后重试'
                    });
                    this.$router.push('/post/list');
                }
            });
        },
        toRouteLink() {
            this.$router.push(this.listPage);
        },
        async insertImage() {
            // 复制图片
            const loading = ElLoading.service({
                lock: true,
                text: '选择图片中',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            imageStrategyContext.getStrategy().upload().then((newPath) => {
                console.log('名字插入')
                // 名字插入
                let monacoEditor = this.$refs.monacoEditor as any;
                let instance = monacoEditor.getInstance() as monaco.editor.IStandaloneCodeEditor;
                instance.executeEdits("", [{
                    range: {
                        startLineNumber: instance.getPosition()!.lineNumber,
                        startColumn: instance.getPosition()!.column,
                        endLineNumber: instance.getPosition()!.lineNumber,
                        endColumn: instance.getPosition()!.column
                    },
                    text: `![在这里插入图片描述](${newPath})`,
                    forceMoveMarkers: true
                }]);
                loading.close();
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: '上传成功'
                });

            }).catch((e) => {
                loading.close();
                if (e === "") {
                    ElMessage({
                        showClose: true,
                        type: 'info',
                        message: '取消上传'
                    });
                } else {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '上传失败，' + e
                    });
                }
            });
        },
        openSetting() {
            this.settingDialog = true;
        },
        openPreview() {
            // 渲染
            this.previewContent = markdownIt.render(this.post.content!);
            this.previewDialog = true;
            this.$nextTick(() => {
                let article = this.$refs.article as HTMLElement;
                article.querySelectorAll('pre code').forEach((block) => {
                    highlight.highlightElement(block as HTMLElement);
                })
            })
        },
        saveOrPublishSwitch(command: string) {
            switch (command) {
                case "saveOrPublish":
                    break;
                case "saveOrPublishForDraft":
                    this.post.status = PostStatusEnum.DRAFT;
                    break;
                case "saveOrPublishForRelease":
                    this.post.status = PostStatusEnum.RELEASE;
                    break;
            }
            this.saveOrPublish();
            this.$router.push(this.listPage)
        },
        saveOrPublish() {
            this.flag ? this.publish() : this.save();
        },
        save() {
            this.saveBySource().then(() => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: '保存成功'
                });
                // 更新列表
            }).catch(e => {
                console.error(e);
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '保存失败，' + e
                });
            });
        },
        saveBySource(): Promise<void> {
            if (this.source === 1) {
                return postService.update(this.post);
            } else if (this.source === 2) {
                return pageService.update(this.post);
            } else {
                return Promise.reject('来源未知');
            }
        },
        publish() {
            this.publishBySource().then(() => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: '发布成功'
                });
                this.flag = false;
                // 更新列表
            }).catch(e => {
                console.error(e);
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '发布失败，' + e
                });
            });
        },
        publishBySource(): Promise<void> {
            if (this.source === 1) {
                return Constant.FOLDER.PAGE().then(postPage => {
                    postService.insert(this.post, postPage);
                })
            } else if (this.source === 2) {
                return Constant.FOLDER.PAGE().then(pagePath => {
                    pageService.insert(this.post, pagePath)
                });
            } else {
                return Promise.reject('来源未知');
            }
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
        }
    }
});
</script>
<style lang="less">
#new-post {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: #ffffff;

    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 10px 20px;
    }

    .post-new-main {
        position: absolute;
        top: 44px;
        left: 0;
        right: 0;
        bottom: 0;

        .post-new-title {
            height: 50px;
            display: flex;
            justify-content: space-between;

            .el-input {
                padding: 9px;
                min-width: 400px;
                max-width: 600px;
            }

            .option {
                .el-button {
                    height: 32px;
                }

                .promotion {
                    margin-right: 20px;
                }
            }
        }

        .post-new-body {
            height: 100%;

            .markdown {
                height: calc(100%);

                .vditor-reset {

                    /*滚动条样式*/

                    &::-webkit-scrollbar {
                        width: 4px;
                    }

                    &::-webkit-scrollbar-thumb {
                        border-radius: 10px;
                        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
                        background: rgba(0, 0, 0, 0.2);
                    }

                    &::-webkit-scrollbar-track {
                        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
                        border-radius: 0;
                        background: rgba(0, 0, 0, 0.1);

                    }
                }
            }
        }

        .post-new-side {
            position: absolute;
            right: 6px;
            top: calc((100% - 200px) / 2 + 36px);
            height: 200px;
            width: 30px;
            z-index: 2;
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            .el-button {
                i {
                    font-size: 1.2em;
                }
            }

            .el-button + .el-button {
                margin-left: 0;
            }
        }
    }
}
</style>