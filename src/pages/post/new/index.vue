<template>
    <div id="new-post">
        <div class="header">
            <el-page-header title="列表" :content="title" @back="toRouteLink('/post/list')" />
        </div>
        <div class="main">
            <div class="title">
                文章
            </div>
            <div class="body">
                <vue-editor class="markdown" :editor="editor"></vue-editor>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { VueEditor, useEditor } from "@milkdown/vue";
import { commonmark } from "@milkdown/preset-commonmark";
import { emoji } from "@milkdown/plugin-emoji";

export default defineComponent({
    name: 'new-post',
    components: {
        VueEditor,
    },
    setup: () => {
        const editor = useEditor((root) =>
            Editor.make()
                .config((ctx) => {
                    ctx.set(rootCtx, root);
                    ctx.set(defaultValueCtx, "");
                })
                .use(nord)
                .use(emoji)
                .use(commonmark)
        );
        return {
            editor,
        };
    },
    data: () => ({
        title: '新文章'
    }),
    created() {
        if (this.$route.query.title) {
            this.title = this.$route.query.title as string;
        }
    },
    methods: {
        toRouteLink(link: string) {
            this.$router.push(link);
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

    .main {
        position: absolute;
        top: 44px;
        left: 0;
        right: 0;
        bottom: 0;

        .title {
            height: 50px;
        }

        .body {
            height: 100%;

            .markdown {
                height: calc(100%);

                .milkdown {
                    height: 100%;
                    overflow: auto;

                    .editor {
                        height: 400px;
                    }
                }
            }
        }
    }
}
</style>