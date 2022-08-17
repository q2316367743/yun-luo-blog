<template>
    <div id="loading">
        <div class="loader">
            <div>l</div>
            <div>o</div>
            <div>a</div>
            <div>d</div>
            <div>i</div>
            <div>n</div>
            <div>g</div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import {settingService, tagService} from "@/global/BeanFactory";
import {ElMessageBox} from "element-plus";
import LocalStorageUtil from "@/utils/LocalStorageUtil";

import './loading.less';
import imageStrategyContext from "@/strategy/image/ImageStrategyContext";
import * as monaco from "monaco-editor";
import markdown from "@/plugins/language/markdown";
import yaml from "@/plugins/language/yaml";

export default defineComponent({
    name: 'loading',
    data: () => ({}),
    async created() {
        this.init().then(() => {
            console.log('初始化完成');
        }).catch(e => {
            console.error(e);
            ElMessageBox.alert('初始化错误', '警告', {
                type: 'error'
            });
        })
    },
    methods: {
        async init() {
            // 1。 处理工作空间
            console.log('1。 处理工作空间');
            let workspace = LocalStorageUtil.get(Constant.LOCALSTORAGE.WORKSPACE);
            if (!workspace) {
                this.$router.push('/workspace');
                return;
            }
            // 2. 处理站点
            console.log('2. 处理站点', workspace);
            let site = LocalStorageUtil.get(Constant.LOCALSTORAGE.SITE);
            if (!site) {
                this.$router.push('/site');
                return;
            }
            // 3. 处理相关目录
            console.log('3. 处理相关目录');
            await this.dirHandle();
            // 4. 部分数据初始化
            console.log('4. 部分数据初始化', site);
            await imageStrategyContext.init();
            await settingService.init();
            await tagService.init();
            // 3.1 启动时注册语言服务
            monaco.languages.register({id: 'markdown'});
            monaco.languages.setMonarchTokensProvider('markdown', markdown.token);
            monaco.languages.setLanguageConfiguration('markdown', markdown.config);
            monaco.languages.registerCompletionItemProvider('markdown', markdown.provider);
            monaco.languages.register({id: 'yaml'});
            monaco.languages.setMonarchTokensProvider('yaml', yaml.token);
            monaco.languages.setLanguageConfiguration('yaml', yaml.config);
            // 5. 跳转
            console.log('5. 跳转');
            this.$router.push('/post/list');
        },
        async dirHandle() {
            // 创建基础文件夹
            await this.createDir(await Constant.FOLDER.BASE());
            // 创建配置文件夹
            await this.createDir(await Constant.FOLDER.CONFIG());
            // 创建项目配置文件夹
            await this.createDir(await Constant.FOLDER.SITE_CONFIG());
            // 创建基础数据
            await this.createDir(await Constant.FOLDER.BASE());
            // 文章目录
            await this.createDir(await Constant.FOLDER.POST());
            // 图片目录
            await this.createDir(await Constant.FOLDER.POST_IMAGES());
            // 部署目录
            await this.createDir(await Constant.FOLDER.DIST());
            // git忽略文件
            let gitignore = await Constant.FILE.GITIGNORE();
            if (!await FileApi.exist(gitignore)) {
                // 不存在则创建
                await FileApi.writeFile(gitignore, Constant.CONTENT.GITIGNORE)
            }
            // Hexo目录
            await this.createDir(await Constant.FOLDER.HEXO());
        },
        async createDir(dir: string) {
            let exist = await FileApi.exist(dir);
            console.log(dir, exist)
            if (exist) {
                // 存在的话直接返回
                return Promise.resolve();
            } else {
                // 不存在则创建
                return FileApi.createDir(dir);
            }
        }
    }
});
</script>
<style lang="less">
#loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    background-color: #ffffff;
    font-weight: 100;
}
</style>