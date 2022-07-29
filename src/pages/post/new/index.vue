<template>
    <div id="new-post">
        <div class="header">
            <el-page-header title="列表" :content="post.title" @back="toRouteLink('/post/list')"/>
        </div>
        <!-- 页面内容 -->
        <div class="post-new-main">
            <div class="post-new-title">
                <el-input v-model="post.title" placeholder="Please input"/>
                <div class="option">
                    <el-button class="save">保存草稿</el-button>
                    <el-button class="promotion" type="primary" @click="saveOrPublish">{{ flag ? '发布' : '保存' }}
                    </el-button>
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
                <el-tooltip class="box-item" effect="dark" content="插入图片" placement="left">
                    <el-button link :icon="pictureFilled" @click="insertImage"></el-button>
                </el-tooltip>
                <el-tooltip class="box-item" effect="dark" content="文章设置" placement="left">
                    <el-button link :icon="tools" @click="openSetting"></el-button>
                </el-tooltip>
                <el-tooltip class="box-item" effect="dark" content="预览" placement="left">
                    <el-button link :icon="starFilled" @click="openPreview"></el-button>
                </el-tooltip>
            </div>
        </div>
        <!-- 文章设置 -->
        <el-drawer v-model="settingDialog" direction="rtl" size="400px">
            <template #header>
                <h2>文章设置</h2>
            </template>
            <template #default>
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
                    <el-form-item label="标签">
                        <el-select v-model="post.tags" multiple filterable allow-create default-first-option
                                   :reserve-keyword="false" style="width: 314px">
                            <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.name"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-cascader v-model="post.categories" :options="categoryTree" :props="categoryProps"
                                     clearable/>
                    </el-form-item>
                    <!-- 其他属性 -->
                    <el-form-item label="额外属性">
                        <div v-for="(item, index) in post.extra" :key="index" style="display: flex">
                            <el-input v-model="item.key" style="width: 170px;">
                                <template #prepend>K</template>
                            </el-input>
                            <div style="line-height: 32px;">=></div>
                            <el-input v-model="item.value" style="width: 170px;">
                                <template #prepend>V</template>
                            </el-input>
                        </div>
                    </el-form-item>
                </el-form>
            </template>
        </el-drawer>
        <!-- 文章预览 -->
        <el-drawer v-model="previewDialog" direction="rtl" size="800px">
            <template #header>
                <h2>{{ post.title }}</h2>
            </template>
            <el-scrollbar>
                <div class="article" ref="article" v-html="previewContent"></div>
            </el-scrollbar>
        </el-drawer>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Check, InfoFilled, MoreFilled, PictureFilled, Promotion, StarFilled, Tools} from '@element-plus/icons-vue';
import highlight from 'highlight.js';
import 'highlight.js/styles/docco.css'
import {open} from '@tauri-apps/api/dialog';
import * as monaco from 'monaco-editor';
import {ElLoading, ElMessage} from "element-plus";

import markdownIt from '@/plugins/markdownIt';

import PostView from "@/views/PostView";
import TagView from "@/views/TagView";
import {copyImage, parsePost} from "@/utils/PostUtil";
import {postService, tagService, categoryService} from '@/global/BeanFactory';

import MarkdownEditor from '@/components/MarkdownEditor/index.vue'

import './actUI.css'
import Entry from "@/global/Entry";
import CategoryView from "@/views/CategoryView";

export default defineComponent({
    name: 'new-post',
    components: {MarkdownEditor},
    setup() {
        const check = markRaw(Check);
        const promotion = markRaw(Promotion);
        const infoFilled = markRaw(InfoFilled);
        const pictureFilled = markRaw(PictureFilled);
        const moreFilled = markRaw(MoreFilled);
        const tools = markRaw(Tools);
        const starFilled = markRaw(StarFilled);
        return {check, promotion, infoFilled, pictureFilled, moreFilled, tools, starFilled}
    },
    data: () => ({
        post: {
            id: 0,
            title: '新文章',
            fileName: '',
            path: '',
            status: 1,
            date: new Date().getTime(),
            updated: new Date().getTime(),
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
    created() {
        tagService.list().then(tags => {
            this.tags = tags;
        })
        categoryService.list().then((categoryTree: Array<CategoryView>) => {
            this.categoryTree = categoryTree;
            console.log(categoryTree)
        })
        if (this.$route.query.id) {
            let postId = parseInt(this.$route.query.id as string);
            postService.info(postId).then(post => {
                if (post) {
                    // 存在文章，查询文章详情
                    parsePost(post.path, post.fileName, true).then(post => {
                        this.post = post!;
                        console.log(post)
                        // 重新对post.id赋值
                        this.post.id = postId;
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
            this.flag = false;
        } else {
            this.flag = true;
            // 新增文章
        }
    },
    mounted() {
        document.onkeydown = (e) => {
            if (e.ctrlKey && e.code == 'KeyS') {
                this.saveOrPublish();
            }
        }
    },
    unmounted() {
        document.onkeydown = null;
    },
    methods: {
        toRouteLink(link: string) {
            this.$router.push(link);
        },
        async insertImage() {
            const selected = await open({
                title: '请选择图片',
                multiple: true,
                filters: [{
                    name: 'Image',
                    extensions: ['jpg', 'jpeg', 'png', 'webp']
                }, {
                    name: '全部',
                    extensions: ['*']
                }]
            });
            if (typeof selected === 'object' && selected) {
                let path = (selected as string[])[0];
                // 复制图片
                const loading = ElLoading.service({
                    lock: true,
                    text: '复制文件中',
                    background: 'rgba(0, 0, 0, 0.7)',
                });
                copyImage(path).then((name) => {
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
                        text: `![在这里插入图片描述](/${name})`,
                        forceMoveMarkers: true
                    }]);
                    loading.close();
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: '插入成功'
                    });

                }).catch(e => {
                    console.error(e);
                    loading.close();
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '插入失败，' + e
                    });
                });
            }
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
        saveOrPublish() {
            this.flag ? this.publish() : this.save();
        },
        save() {
            postService.update(this.post)
                .then(() => {
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
        publish() {
            postService.insert(this.post).then(() => {
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