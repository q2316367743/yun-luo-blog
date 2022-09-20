<template>
    <container-header>
        <el-page-header title="工具" content="关于" @back="goBack" style="margin-top: 8px;"/>
    </container-header>
    <container-main>
        <el-scrollbar>
            <article class="markdown-section">
                <h1 id="云落博客">关于 云落博客</h1>
                <p>
                    <span>版本：</span>
                    <el-tag>0.3.3</el-tag>
                    <el-tag type="success" style="margin-left: 8px;">build 2022年09月20日</el-tag>
                </p>
                <p>
                    <span>Copyright 2022 </span>
                    <el-link type="primary" @click="openUrl('https://blog.esion.xyz')">落雨不悔</el-link>
                    <span>。 版权所有。</span>
                </p>
                <p>
                    <span>云落博客 由</span>
                    <el-link type="primary" @click="openUrl('https://blog.esion.xyz')">落雨不悔</el-link>
                    <span>开发并由</span>
                    <el-link type="primary" @click="openUrl('https://electronjs.org/')">Electron</el-link>
                    <span>和</span>
                    <el-link type="primary" @click="toOpenSource">其他开源项目</el-link>
                    <span>制作的</span>
                    <el-link type="primary" @click="openUrl('https://github.com/q2316367743/yun-luo-blog')">开源软件</el-link>
                    <span>。</span>
                </p>
                <p>
                    <span>我们不会在您使用 云落博客 应用时</span>
                    <strong>收集任何</strong>
                    <span>个人数据；我们不会存储、跟踪或允许第三方收集有关您的个人身份信息。</span>
                </p>
                <p>
                    <el-link type="primary" @click="toLicense">开源许可证</el-link>
                </p>
                <h2>其他资源</h2>
                <p>
                    <strong>仓库：</strong>
                    <el-link type="primary" @click="openUrl('https://github.com/q2316367743/yun-luo-blog')">GitHub</el-link>
                    <span> | </span>
                    <el-link type="primary" @click="openUrl('https://gitee.com/qiaoshengda/yun-luo-blog')">Gitee</el-link>
                </p>
                <p>
                    <strong>文档：</strong>
                    <el-link type="primary" @click="openUrl('https://q2316367743.github.io/yun-luo-blog')">GitHub Pages</el-link>
                    <span> | </span>
                    <el-link type="primary" @click="openUrl('https://docs.esion.xyz/yun-luo-blog')">国内访问</el-link>
                </p>
            </article>
        </el-scrollbar>
    </container-main>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";
import NativeApi from "@/api/NativeApi";

export default defineComponent({
    name: 'about',
    components: {ContainerMain, ContainerHeader},
    data: () => ({}),
    methods: {
        goBack() {
            this.$router.push('/tool');
        },
        openUrl: NativeApi.openUrl,
        toLicense() {
            this.$router.push('/tool/about/license')
        },
        toOpenSource() {
            this.$router.push('/tool/about/openSource')
        }
    }
});
</script>
<style scoped lang="less">

.markdown-section {
    margin: 0 auto;
    padding: 30px 40px;
    position: relative
}

.markdown-section h1 {
    font-size: 2rem;
    margin: 0 0 1rem;
}

.markdown-section h2 {
    font-size: 1.75rem;
    margin: 45px 0 0.8rem;
}

.markdown-section > * {
    box-sizing: border-box;
    font-size: inherit
}

.markdown-section > :first-child {
    margin-top: 0 !important
}

.markdown-section hr {
    border: none;
    border-bottom: 1px solid #eee;
    margin: 2em 0
}

.markdown-section iframe {
    border: 1px solid #eee;
    width: 1px;
    min-width: 100%
}

.markdown-section table {
    border-collapse: collapse;
    border-spacing: 0;
    display: block;
    margin-bottom: 1rem;
    overflow: auto;
    width: 100%
}

.markdown-section th {
    font-weight: 700
}

.markdown-section td, .markdown-section th {
    border: 1px solid #ddd;
    padding: 6px 13px
}

.markdown-section tr {
    border-top: 1px solid #ccc
}

.markdown-section tr:nth-child(2n) {
    background-color: #f8f8f8
}

.markdown-section p {
    font-size: 14px;
    font-weight: 500;
    color: #606266;
}

.markdown-section p .el-link {
    vertical-align: top;
}

.markdown-section p.tip {
    background-color: #f8f8f8;
    border-bottom-right-radius: 2px;
    border-left: 4px solid #f66;
    border-top-right-radius: 2px;
    margin: 2em 0;
    padding: 12px 24px 12px 30px;
    position: relative
}

.markdown-section p.tip:before {
    background-color: #f66;
    border-radius: 100%;
    color: #fff;
    content: "!";
    font-family: Dosis, Source Sans Pro, Helvetica Neue, Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    left: -12px;
    line-height: 20px;
    position: absolute;
    height: 20px;
    width: 20px;
    text-align: center;
    top: 14px
}

.markdown-section p.tip code {
    background-color: #efefef
}

.markdown-section p.tip em {
    color: #34495e
}

.markdown-section p.warn {
    background: rgba(66, 185, 131, .1);
    border-radius: 2px;
    padding: 1rem
}

.markdown-section ul.task-list > li {
    list-style-type: none
}

.markdown-section code {
    background-color: #f8f8f8;
    color: #e96900;
    border-radius: 2px;
    margin: 0 2px;
    padding: 3px 5px;
    white-space: pre-wrap;
}

.markdown-section ol, .markdown-section ul {
    padding-left: 1.5rem;
}

.markdown-section ol, .markdown-section p, .markdown-section ul {
    line-height: 1.6rem;
    word-spacing: 0.05rem;
}

.markdown-section ul, .markdown-section ol {
    padding-left: 1.5rem;
}

.markdown-section p, .markdown-section ul, .markdown-section ol {
    line-height: 1.6rem;
    word-spacing: 0.05rem;
}

.markdown-section figure, .markdown-section p, .markdown-section ul, .markdown-section ol {
    margin: 1.2em 0;
}

</style>