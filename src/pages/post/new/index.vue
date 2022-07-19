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
                    <el-button class="promotion" type="primary">发布</el-button>
                </div>
            </div>
            <div class="post-new-body">
                <div id="vditor" class="markdown" />
            </div>
            <div class="post-new-side">
                <el-button link :icon="infoFilled"></el-button>
                <el-tooltip class="box-item" effect="dark" content="插入图片" placement="left">
                    <el-button link :icon="pictureFilled" @click="insertImage"></el-button>
                </el-tooltip>
                <el-tooltip class="box-item" effect="dark" content="文章设置" placement="left">
                    <el-button link :icon="tools"></el-button>
                </el-tooltip>
                <el-tooltip class="box-item" effect="dark" content="预览" placement="left">
                    <el-button link :icon="starFilled"></el-button>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, markRaw } from "vue";
import { Check, Promotion, InfoFilled, PictureFilled, MoreFilled, Tools, StarFilled } from '@element-plus/icons-vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { Post } from "@/types/Post";
import { renderPost } from "@/utils/PostUtil";

export default defineComponent({
    name: 'new-post',
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
        vditor: null as Vditor | null,
        post: {
            title: '新文章',
            content: ''
        } as Post
    }),
    created() {
        if (this.$route.query.title) {
            this.post.title = this.$route.query.title as string;
        }
        if (this.$route.query.path) {
            // 渲染
            renderPost(this.$route.query.path as string, '新文章', true).then(post => {
                this.post = post!;
                this.vditor?.setValue(this.post.content!)
            });
        }
    },
    mounted() {
        this.vditor = new Vditor('vditor', {
            height: 'calc(100% - 50px)',
            after: () => {
                this.vditor?.setValue(this.post.content!)
            },
        });
    },
    unmounted() {
        this.vditor?.setValue("");
    },
    methods: {
        toRouteLink(link: string) {
            this.$router.push(link);
        },
        insertImage() {
            console.log(convertFileSrc('D:\\Documents\\yun-luo-blog\\post-images\\黄昏.jpg'))
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
            right: 4px;
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