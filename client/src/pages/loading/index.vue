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
import * as monaco from "monaco-editor";

import './loading.less';

// 语言
import markdown from "@/plugins/language/markdown";
import yaml from "@/plugins/language/yaml";
import css from "@/plugins/language/css";
import less from "@/plugins/language/less";
import scss from "@/plugins/language/scss";
import pug from "@/plugins/language/pug";
import javascript from "@/plugins/language/javascript";
import typescript from "@/plugins/language/typescript";

export default defineComponent({
    name: 'loading',
    data: () => ({}),
    async created() {
        // 注册语言服务器
        this.registerLanguageService();
        // TODO: 判断登陆状态
        // 跳转到文章列表
        this.$router.push('/post/list');
    },
    methods: {
        registerLanguageService() {
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
        },
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