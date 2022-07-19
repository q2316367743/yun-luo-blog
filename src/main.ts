import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia';

const pinia = createPinia();

import router from '@/plugin/router';

createApp(App)
    .use(ElementPlus)
    .use(pinia)
    .use(router)
    .mount('#app')
