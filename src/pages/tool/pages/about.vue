<template>
    <container-header>
        <el-page-header title="工具" content="关于" @back="goBack" style="margin-top: 8px;"/>
    </container-header>
    <container-main>
        <el-scrollbar>
            <article class="markdown-section">
                <h1 id="云落博客">云落博客</h1>
                <p>️一个静态博客写作客户端 (A static blog writing client)</p>
                <h2 id="简介">简介</h2>
                <p>一个静态博客写作客户端，可以搭配多种博客生成器（hexo、vuepress。。。），可视化配置</p>
                <h2 id="特性">特性</h2>
                <ul>
                    <li>📝 你可以使用最酷的&nbsp;<strong>Markdown</strong>&nbsp;语法，进行快速创作</li>
                    <li>🌉 你可以给文章配上精美的封面图和在文章任意位置插入图片</li>
                    <li>🏷️ 你可以对文章进行标签分组</li>
                    <li>💻
                        你可以在&nbsp;<strong>𝖶𝗂𝗇𝖽𝗈𝗐𝗌</strong>&nbsp;或&nbsp;<strong>𝖬𝖺𝖼𝖮𝖲</strong>&nbsp;或&nbsp;<strong>Linux</strong>&nbsp;设备上使用此客户端
                    </li>
                    <li>🌎 你可以使用&nbsp;<strong>𝖦𝗂𝗍𝗁𝗎𝖻 𝖯𝖺𝗀𝖾𝗌</strong>&nbsp;或&nbsp;<strong>Coding Pages</strong>&nbsp;向世界展示，未来将支持更多平台
                    </li>
                    <li>🇬🇧 你可以使用<strong>中文简体</strong>、<strong>中文繁体</strong>、<strong>英语</strong></li>
                    <li>🌁 你可以任意使用应用内默认主题或任意第三方主题，强大的主题自定义能力</li>
                    <li>🖥 你可以自定义源文件夹，利用 OneDrive、百度网盘、iCloud、Dropbox 等进行多设备同步</li>
                </ul>
                <p>未来，它一定会成为你离不开的伙伴</p>
                <p>尽情发挥你的才华吧！</p>
                <p>😘 Enjoy~</p>
                <h2 id="亮点">亮点</h2>
                <ol>
                    <li>更好用的markdown编辑器，基于Monaco Editor编辑器，语法提示，本地图片提示</li>
                    <li>分类管理，标签管理，可以更快速的选择标签</li>
                    <li>可视化配置，免去查询配置文档的麻烦</li>
                    <li>图片存储可选择<code>本地</code>、<code>七牛云</code>、<code>PicGo</code></li>
                    <li>一键执行相关命令：<strong>打包</strong>、<strong>运行</strong>、<strong>编译</strong></li>
                    <li>一键发布到<code>GitHub Pages</code>、<code>Gitee Pages</code>、<code>FTP</code>、<code>SFTP</code>
                    </li>
                </ol>
                <h2 id="技术选型">技术选型</h2>
                <ul>
                    <li>
                        <el-link href="[Tauri](https://tauri.studio/)" target="_blank" rel="noopener">Tauri</el-link>
                    </li>
                    <li>
                        <el-link href="https://element-plus.gitee.io/zh-CN/" target="_blank" rel="noopener">Element
                            Plus
                        </el-link>
                    </li>
                    <li>
                        <el-link href="https://v3.cn.vuejs.org/" target="_blank" rel="noopener">Vue3</el-link>
                    </li>
                    <li>
                        <el-link href="https://vitejs.cn/" target="_blank" rel="noopener">Vite2</el-link>
                    </li>
                    <li>
                        <el-link href="https://www.tslang.cn/" target="_blank" rel="noopener">TypeScript</el-link>
                    </li>
                </ul>
                <h2 id="站在巨人的肩膀上">站在巨人的肩膀上</h2>
                <ul>
                    <li>
                        <el-link href="https://gitee.com/fehey/gridea" target="_blank" rel="noopener">Gridea</el-link>
                    </li>
                    <li>
                        <el-link href="https://gitee.com/cwxyz007/vscode-hexo-utils" target="_blank" rel="noopener">
                            vscode-hexo-utils
                        </el-link>
                    </li>
                    <li>
                        <el-link href="https://github.com/GetPublii/Publii" target="_blank" rel="noopener">Publii
                        </el-link>
                    </li>
                </ul>
            </article>
        </el-scrollbar>
    </container-main>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";

export default defineComponent({
    name: '',
    components: {ContainerMain, ContainerHeader},
    data: () => ({}),
    methods: {
        goBack() {
            this.$router.push('/tool');
        },
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