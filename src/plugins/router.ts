import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'


import GuidePage from '@/pages/guide/index.vue';
import PostListPage from '@/pages/post/list/index.vue';
import PostNewPage from '@/pages/post/new/index.vue';
import TagPage from '@/pages/tag/index.vue';
import ThemeSettingPage from '@/pages/theme/setting/index.vue';
import PluginPage from '@/pages/plugin/index.vue';
import HexoConfigPage from '@/pages/config/hexo/index.vue';
import SettingPage from '@/pages/setting/index.vue';

/**
 * 定义路由模块
 */
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/post/list"
    },
    {
        path: '/guide',
        name: 'guide',
        component: GuidePage
    },
    {
        path: '/post',
        name: 'post',
        children: [
            {
                path: '/post/list',
                name: 'post-list',
                component: PostListPage
            },
            {
                path: '/post/new',
                name: 'post-new',
                component: PostNewPage
            },
        ]
    },
    {
        path: '/tag',
        name: 'tag',
        component: TagPage
    },
    {
        path: '/theme',
        name: 'theme',
        component: ThemeSettingPage,
        children: [{
            path: '/theme/setting',
            name: 'theme-setting',
            component: ThemeSettingPage
        }]
    },
    {
        path: '/plugin',
        name: 'plugin',
        component: PluginPage
    },
    {
        path: '/config/hexo',
        name: 'config-hexo',
        component: HexoConfigPage
    },
    {
        path: '/setting',
        name: 'setting',
        component: SettingPage
    }
]

/**
 * 定义返回模块
 */
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router