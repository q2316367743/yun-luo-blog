<template>
    <div id="new-post">
        <div class="header">
            <el-page-header title="列表" :content="post.title" @back="toRouteLink"/>
        </div>
        <!-- 页面内容 -->
        <div class="post-new-main">
            <div class="post-new-title">
                <el-input v-model="post.title" placeholder="文章标题"/>
                <div class="option">
                    <el-dropdown class="promotion" split-button type="primary" @click="saveOrPublish"
                                 @command="saveOrPublishSwitch">
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
        <el-dialog v-model="settingDialog" draggable :close-on-click-modal="false"
                   top="15vh" @close="settingDialogClose" destroy-on-close>
            <template #header>
                <h2>{{ sourceType }}设置</h2>
            </template>
            <post-setting :post-view="post" ref="postSetting"/>
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

import TagView from "@/views/TagView";
import imageStrategyContext from "@/strategy/image/ImageStrategyContext";

import MarkdownEditor from '@/components/MarkdownEditor/index.vue'

import '@/less/post.css'
import Entry from "@/global/Entry";
import CategoryView from "@/views/CategoryView";
import PostStatusEnum from "@/enumeration/PostStatusEnum";
import Constant from "@/global/Constant";
import PostSetting from "@/pages/postSetting/index.vue";
import PostSettingPage from "@/pages/postSetting/index";

// 导入API
import PostApi from "@/api/PostApi";
import CategoryApi from "@/api/CategoryApi";
import TagApi from "@/api/TagApi";
import PageApi from "@/api/PageApi";
import PostInfoView from "@/views/PostInfoView";

export default defineComponent({
    name: 'post-edit',
    components: {PostSetting, MarkdownEditor},
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
            layout: '',
            path: '',
            status: PostStatusEnum.RELEASE,
            date: '',
            updated: '',
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
        } as PostInfoView,
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
        this.source = parseInt(this.$route.params.type as string);
        TagApi.list().then(tags => {
            this.tags = tags;
        })
        CategoryApi.list().then((categoryTree: Array<CategoryView>) => {
            this.categoryTree = categoryTree;
        })
        if (this.$route.query.id) {
            let postId = parseInt(this.$route.params.id as string);
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
            if (this.$route.query.layout) {
                this.post.layout = this.$route.query.layout as string;
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
            PostApi.info(postId).then(post => {
                if (post) {
                    // 存在文章，查询文章详情
                    this.post = post!;
                    // 重新对post.id赋值
                    this.post.id = postId;
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
            PageApi.info(postId).then(page => {
                if (page) {
                    // 存在文章，查询文章详情
                    this.post = page!;
                    // 重新对post.id赋值
                    this.post.id = postId;
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
                return PostApi.update(this.post);
            } else if (this.source === 2) {
                return PageApi.update(this.post);
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
                PostApi.insert(this.post);
            } else if (this.source === 2) {
                PageApi.insert(this.post)
            } else {
                return Promise.reject('来源未知');
            }
            return Promise.resolve();
        },
        settingDialogClose() {
            // 先获取配置
            let postSetting = this.$refs.postSetting as PostSettingPage;
            if (postSetting) {
                console.log(postSetting.getView());
                this.post = {
                    ...postSetting.getView(),
                    title: this.post.title,
                    content: this.post.content,
                };
                postSetting.setView(this.post);
                console.log(this.post);
            }
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