import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia';

import router from '@/plugins/router';

const pinia = createPinia();


createApp(App)
    .use(ElementPlus)
    .use(pinia)
    .use(router)
    .mount('#app')
