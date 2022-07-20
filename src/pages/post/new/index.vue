<template>
    <div id="new-post">
        <div class="header">
            <el-page-header title="列表" :content="post.title" @back="toRouteLink('/post/list')" />
        </div>
        <div class="post-new-main">
            <div class="post-new-title">
                <el-input v-model="post.title" placeholder="Please input" />
                <div class="option">
                    <el-button class="save">保存草稿</el-button>
                    <el-button class="promotion" type="primary" @click="saveOrPublish">{{ flag ? '发布' : '保存' }}</el-button>
                </div>
            </div>
            <div class="post-new-body">
                <monaco-editor height="height: calc(100%);" v-model="post.content" language="markdown"></monaco-editor>
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
        <el-drawer v-model="settingDialog" direction="rtl">
            <template #header>
                <h2>文章设置</h2>
            </template>
            <template #default>
                <el-form v-model="post" label-position="top">
                    <el-form-item label="文章网址">
                        <el-input v-model="post.permalink"></el-input>
                    </el-form-item>
                    <el-form-item label="标签">
                        <el-select v-model="post.tags" multiple filterable allow-create default-first-option
                            :reserve-keyword="false" style="width: 314px">
                            <el-option v-for="item in tags" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker v-model="post.date" type="datetime" :default-time="new Date()" />
                    </el-form-item>
                </el-form>
            </template>
        </el-drawer>
        <el-drawer v-model="previewDialog" direction="rtl" size="80%">
            <template #header>
                <h2>{{ post.title }}</h2>
            </template>
            <div class="article" v-html="previewContent"></div>
        </el-drawer>
    </div>
</template>
<script lang="ts">
import { defineComponent, markRaw } from "vue";
import { Check, Promotion, InfoFilled, PictureFilled, MoreFilled, Tools, StarFilled } from '@element-plus/icons-vue';
import { convertFileSrc } from "@tauri-apps/api/tauri";
import highlight from 'highlight.js';
import markdownIt from '@/plugin/markdownIt';

import { Post } from "@/types/Post";
import { parsePost, savePost } from "@/utils/PostUtil";
import { usePostStore } from "@/store/PostStore";

import MonacoEditor from '@/components/MonacoEditor/index.vue'

import './actUI.css'
import { ElMessage } from "element-plus";

export default defineComponent({
    name: 'new-post',
    components: { MonacoEditor },
    setup() {
        const check = markRaw(Check);
        const promotion = markRaw(Promotion);
        const infoFilled = markRaw(InfoFilled);
        const pictureFilled = markRaw(PictureFilled);
        const moreFilled = markRaw(MoreFilled);
        const tools = markRaw(Tools);
        const starFilled = markRaw(StarFilled);
        return { check, promotion, infoFilled, pictureFilled, moreFilled, tools, starFilled }
    },
    data: () => ({
        post: {
            title: '新文章',
            fileName: '',
            path: '',
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
            content: ''
        } as Post,
        textLength: 0,
        tags: usePostStore().tags,
        settingDialog: false,
        previewDialog: false,
        previewContent: '',
        // true新增，false修改
        flag: true,
    }),
    created() {
        if (this.$route.query.title) {
            this.post.title = this.$route.query.title as string;
        }
        if (this.$route.query.path) {
            // 渲染
            parsePost(this.$route.query.path as string,
                this.$route.query.fileName ? this.$route.query.fileName as string : '新文章',
                true).then(post => {
                    this.post = post!;
                });
            this.flag = false;
        }
    },
    methods: {
        toRouteLink(link: string) {
            this.$router.push(link);
        },
        insertImage() {
            console.log(convertFileSrc('D:\\Documents\\yun-luo-blog\\post-images\\黄昏.jpg'))
        },
        openSetting() {
            this.settingDialog = true;
        },
        openPreview() {
            // 渲染
            this.previewContent = markdownIt.render(this.post.content!);
            this.previewDialog = true;
            this.$nextTick(() => {
                highlight.initHighlighting()
            })
        },
        saveOrPublish() {
            this.flag ? this.publish() : this.save();
        },
        save() {
            savePost(this.post).then(() => {
                ElMessage.success('保存成功');
            }).catch(e => {
                console.error(e);
                ElMessage.error('保存失败，' + e);
            });
        },
        publish() {
            console.log('发布')
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

            .el-button+.el-button {
                margin-left: 0;
            }
        }
    }
}
</style>