import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'


import PostListPage from '@/pages/post/list/index.vue';
import PostNewPage from '@/pages/post/new/index.vue';
import TagPage from '@/pages/tag/index.vue';
import CategoryPage from "@/pages/category/index.vue";
import PrettyPage from '@/pages/pretty/index.vue';
import HexoConfigPage from '@/pages/config/hexo/index.vue';

/**
 * 定义路由模块
 */
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/post/list"
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
        path: '/category',
        name: 'category',
        component: CategoryPage
    },
    {
        path: '/pretty',
        name: 'pretty',
        component: PrettyPage
    },
    {
        path: '/config/hexo',
        name: 'config-hexo',
        component: HexoConfigPage
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