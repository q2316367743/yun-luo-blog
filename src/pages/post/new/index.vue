<template>
    <div id="new-post">
        <div class="header">
            <el-page-header title="列表" :content="title" @back="toRouteLink('/post/list')" />
        </div>
        <div class="main">
            <div class="title">
                <el-input v-model="title" placeholder="Please input" />
                <div class="option">
                    <el-button class="save">保存草稿</el-button>
                    <el-button class="promotion" type="primary">发布</el-button>
                </div>
            </div>
            <div class="body">
                <div id="vditor" class="markdown" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, markRaw } from "vue";
import { Check, Promotion } from '@element-plus/icons-vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

export default defineComponent({
    name: 'new-post',
    setup() {
        const check = markRaw(Check);
        const promotion = markRaw(Promotion);
        return { check, promotion }
    },
    data: () => ({
        title: '新文章',
        vditor: null as Vditor | null
    }),
    created() {
        if (this.$route.query.title) {
            this.title = this.$route.query.title as string;
        }
    },
    mounted() {
        this.vditor = new Vditor('vditor', {
            height: 'calc(100% - 50px)',
            after: () => {
            },
        });
    },
    methods: {
        toRouteLink(link: string) {
            this.$router.push(link);
        }
    },
    unmounted() {
        this.vditor?.setValue("");
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
            display: flex;
            justify-content: space-between;

            .el-input {
                padding: 9px;
                width: 400px;
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

        .body {
            height: 100%;

            .markdown {
                height: calc(100%);
            }
        }
    }
}
</style>