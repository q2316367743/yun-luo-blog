import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia';

import router from '@/plugins/router';
import * as monaco from "monaco-editor";
import markdown from "@/plugins/language/markdown";


// 创建时注册语言服务
monaco.languages.register({ id: 'markdown' });
monaco.languages.setMonarchTokensProvider('markdown', markdown.token);
monaco.languages.setLanguageConfiguration('markdown', markdown.config);
monaco.languages.registerCompletionItemProvider('markdown', markdown.provider);


createApp(App)
    .use(ElementPlus)
    .use(createPinia())
    .use(router)
    .mount('#app')
