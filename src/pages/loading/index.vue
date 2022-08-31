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
import {
    categoryDb,
    pageCategoryDb,
    pageDb,
    pageTagDb,
    postCategoryDb,
    postDb,
    postTagDb,
    settingService,
    tagDb,
} from "@/global/BeanFactory";
import {ElMessageBox} from "element-plus";
import LocalStorageUtil from "@/utils/LocalStorageUtil";

import './loading.less';
import imageStrategyContext from "@/strategy/image/ImageStrategyContext";
import * as monaco from "monaco-editor";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

// 语言
import markdown from "@/plugins/language/markdown";
import yaml from "@/plugins/language/yaml";
import css from "@/plugins/language/css";
import less from "@/plugins/language/less";
import scss from "@/plugins/language/scss";
import pug from "@/plugins/language/pug";
import javascript from "@/plugins/language/javascript";
import typescript from "@/plugins/language/typescript";


import emitter from "@/plugins/mitt";


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
            console.log('1. 处理工作空间');
            let workspace = LocalStorageUtil.get(Constant.LOCALSTORAGE.WORKSPACE);
            if (!workspace) {
                this.$router.push('/workspace');
                return;
            }
            // 1.1 处理工作空间文件夹
            console.log('1.1 处理工作空间文件夹');
            await this.createDir(await Constant.FOLDER.WORKSPACE());
            // 2. 处理站点
            console.log('2. 处理站点', workspace);
            // 2.1 处理站点文件夹
            console.log('2.1 处理站点文件夹')
            await this.createDir(await Constant.FOLDER.SITE());
            // 2.2 处理站点文件夹
            console.log('2.2 处理配置文件夹')
            await this.createDir(await Constant.FOLDER.CONFIG());
            // 2.2 站点初始化
            console.log('2.2 站点初始化');
            await settingService.initSite();
            let siteSetting = settingService.getSite();
            if (siteSetting.active.id === 0) {
                // 没有选择站点
                this.$router.push('/site');
                return;
            }
            // 将站点保存到localStorage进行缓存
            console.log('将站点保存到localStorage进行缓存');
            LocalStorageUtil.set(Constant.LOCALSTORAGE.SITE, siteSetting.active);
            // 3. 处理相关目录
            console.log('3. 处理相关目录', siteSetting);
            await this.dirHandle();
            // 4. 部分数据初始化
            console.log('4. 部分数据初始化');
            await imageStrategyContext.init();
            await settingService.init();
            console.log('4.1 数据库初始化');
            await this.dbInit();
            // 4.2 启动时注册语言服务
            console.log('4.2 启动时注册语言服务')
            monaco.languages.register({id: 'markdown'});
            monaco.languages.setMonarchTokensProvider('markdown', markdown.token);
            monaco.languages.setLanguageConfiguration('markdown', markdown.config);
            monaco.languages.registerCompletionItemProvider('markdown', markdown.provider);
            monaco.languages.register({id: 'yaml'});
            monaco.languages.setMonarchTokensProvider('yaml', yaml.token);
            monaco.languages.setLanguageConfiguration('yaml', yaml.config);
            monaco.languages.register({id: 'css'});
            monaco.languages.setMonarchTokensProvider('css', css.token);
            monaco.languages.setLanguageConfiguration('css', css.conf);
            monaco.languages.register({id: 'less'});
            monaco.languages.setMonarchTokensProvider('less', less.token);
            monaco.languages.setLanguageConfiguration('less', less.conf);
            monaco.languages.register({id: 'scss'});
            monaco.languages.setMonarchTokensProvider('scss', scss.token);
            monaco.languages.setLanguageConfiguration('scss', scss.conf);
            monaco.languages.register({id: 'pug'});
            monaco.languages.setMonarchTokensProvider('pug', pug.token);
            monaco.languages.setLanguageConfiguration('pug', pug.conf);
            monaco.languages.register({id: 'js'});
            monaco.languages.setMonarchTokensProvider('js', javascript.token);
            monaco.languages.setLanguageConfiguration('js', javascript.config);
            monaco.languages.register({id: 'ts'});
            monaco.languages.setMonarchTokensProvider('ts', typescript.token);
            monaco.languages.setLanguageConfiguration('ts', typescript.config);
            // 5. 发送消息
            console.log('5. 发送消息');
            emitter.emit(MessageEventEnum.APP_LAUNCH);
            // 6. 跳转
            console.log('6. 跳转');
            this.$router.push('/post/list');
        },
        async dirHandle() {
            // 创建基础配置文件夹
            await this.createDir(await Constant.FOLDER.CONFIG());
            // 创建基础站点文件夹
            await this.createDir(await Constant.FOLDER.SITE());
            // 创建站点基础文件夹
            await this.createDir(await Constant.FOLDER.BASE());
            // 创建项目配置文件夹
            await this.createDir(await Constant.FOLDER.SITE_CONFIG());
            // 文章目录
            await this.createDir(await Constant.FOLDER.POST());
            // 页面目录
            await this.createDir(await Constant.FOLDER.PAGE());
            // 图片目录
            await this.createDir(await Constant.FOLDER.POST_IMAGES());
            // 资源目录
            await this.createDir(await Constant.FOLDER.SOURCE());
            // 部署目录
            await this.createDir(await Constant.FOLDER.DIST());
            // 工作空间git忽略文件
            let gitignoreForWorkspace = await Constant.FILE.GITIGNORE_WORKSPACE();
            if (!await FileApi.exist(gitignoreForWorkspace)) {
                // 不存在则创建
                await FileApi.writeFile(gitignoreForWorkspace, Constant.CONTENT.GITIGNORE_WORKSPACE)
            }
            // 站点git忽略文件
            let gitignoreForSite = await Constant.FILE.GITIGNORE_SITE();
            if (!await FileApi.exist(gitignoreForSite)) {
                // 不存在则创建
                await FileApi.writeFile(gitignoreForSite, Constant.CONTENT.GITIGNORE_SITE)
            }
            // Hexo目录
            await this.createDir(await Constant.FOLDER.HEXO.BASE());
        },
        async createDir(dir: string) {
            let exist = await FileApi.exist(dir);
            if (exist) {
                // 存在的话直接返回
                return Promise.resolve();
            } else {
                // 不存在则创建
                return FileApi.createDir(dir);
            }
        },
        async dbInit() {
            tagDb.setPath(await Constant.FILE.DB_TAG());
            await tagDb.init();
            categoryDb.setPath(await Constant.FILE.DB_CATEGORY());
            await categoryDb.init();
            postDb.setPath(await Constant.FILE.DB_POST());
            await postDb.init();
            postTagDb.setPath(await Constant.FILE.DB_POST_TAG());
            await postTagDb.init();
            postCategoryDb.setPath(await Constant.FILE.DB_POST_CATEGORY());
            await postCategoryDb.init();
            pageDb.setPath(await Constant.FILE.DB_PAGE());
            await pageDb.init();
            pageTagDb.setPath(await Constant.FILE.DB_PAGE_TAG());
            await pageTagDb.init();
            pageCategoryDb.setPath(await Constant.FILE.DB_PAGE_CATEGORY());
            await pageCategoryDb.init();
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