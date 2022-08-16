import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia';

import router from '@/plugins/router';
import * as monaco from "monaco-editor";
import markdown from "@/plugins/language/markdown";
import yaml from "@/plugins/language/yaml";
import i18n from '@/i18n';

import './main.less';
import './theme/light.less';
import './theme/dark.less';

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// Monaco Editor 在Vite中的配置
// @ts-ignore
self.MonacoEnvironment = {
    getWorker(_: any, label: string) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

// 启动时注册语言服务
monaco.languages.register({ id: 'markdown' });
monaco.languages.setMonarchTokensProvider('markdown', markdown.token);
monaco.languages.setLanguageConfiguration('markdown', markdown.config);
monaco.languages.registerCompletionItemProvider('markdown', markdown.provider);
monaco.languages.register({ id: 'yaml' });
monaco.languages.setMonarchTokensProvider('yaml', yaml.token);
monaco.languages.setLanguageConfiguration('yaml', yaml.config);


createApp(App)
    .use(ElementPlus)
    .use(createPinia())
    .use(router)
    .use(i18n)
    .mount('#app')
