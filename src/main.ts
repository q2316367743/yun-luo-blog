import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia';

import router from '@/plugins/router';
import * as monaco from "monaco-editor";
import markdown from "@/plugins/language/markdown";
import yaml from "@/plugins/language/yaml";
import hexo from "@/plugins/language/hexo";


// 创建时注册语言服务
monaco.languages.register({ id: 'markdown' });
monaco.languages.setMonarchTokensProvider('markdown', markdown.token);
monaco.languages.setLanguageConfiguration('markdown', markdown.config);
monaco.languages.registerCompletionItemProvider('markdown', markdown.provider);
monaco.languages.register({id: 'yaml'});
monaco.languages.setMonarchTokensProvider('yaml', yaml.token);
monaco.languages.setLanguageConfiguration('yaml', yaml.config);
monaco.languages.register({id: 'hexo'});
monaco.languages.setMonarchTokensProvider('hexo', hexo.token);
monaco.languages.setLanguageConfiguration('hexo', hexo.config);


createApp(App)
    .use(ElementPlus)
    .use(createPinia())
    .use(router)
    .mount('#app')
