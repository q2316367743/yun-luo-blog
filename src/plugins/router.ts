import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'


import GuidePage from '@/pages/guide/index.vue';
import PostListPage from '@/pages/post/list/index.vue';
import PostNewPage from '@/pages/post/new/index.vue';
import TagPage from '@/pages/tag/index.vue';
import ThemeSetting from '@/pages/theme/setting/index.vue';
import SettingPage from '@/pages/setting/index.vue';

/**
 * 定义路由模块
 * 2022年2月28日21:41:54
 * CL
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
        component: ThemeSetting,
        children: [{
            path: '/theme/setting',
            name: 'theme-setting',
            component: ThemeSetting
        }]
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
    history: createWebHashHistory(),  // 设置为history模式，就是路径里面没有#,  createWebHashHistory 是默认的，括号里面的就是基础路径，可以理解为项目名称，就是请求路径的基础url
    routes
})

export default router