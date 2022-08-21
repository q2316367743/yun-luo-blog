import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

import LoadingPage from '@/pages/loading/index.vue';
import WorkspacePage from "@/pages/workspace/index.vue";
import SitePage from '@/pages/site/index.vue';
import PostListPage from '@/pages/post/list/index.vue';
import PostNewPage from '@/pages/post/new/index.vue';
import TagPage from '@/pages/tag/index.vue';
import CategoryPage from "@/pages/category/index.vue";
import PrettyHexoPage from '@/pages/pretty/hexo/index.vue';
import ConfigHexoPage from '@/pages/config/hexo/index.vue';
import ToolPage from '@/pages/tool/index.vue';
import ToolImportPage from '@/pages/tool/pages/import.vue';
import ToolBackupPage from '@/pages/tool/pages/backup.vue';
import ToolSyncRemotePage from '@/pages/tool/pages/sync-remote.vue';
import ToolAboutPage from '@/pages/about/index.vue';

/**
 * 定义路由模块
 */
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/loading"
    },
    {
        path: '/loading',
        name: 'loading',
        component: LoadingPage
    },
    {
        path: '/workspace',
        name: 'workspace',
        component: WorkspacePage
    },
    {
        path: '/site',
        name: 'site',
        component: SitePage
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
        path: '/pretty/hexo',
        name: 'pretty-hexo',
        component: PrettyHexoPage
    },
    {
        path: '/config/hexo',
        name: 'config-hexo',
        component: ConfigHexoPage
    },
    {
        path: "/tool",
        name: 'tool',
        component: ToolPage,
    },
    {
        path: '/tool/backup',
        name: 'tool-backup',
        component: ToolBackupPage
    },
    {
        path: '/tool/import',
        name: 'tool-import',
        component: ToolImportPage
    },
    {
        path: '/tool/sync-remote',
        name: 'tool-sync-remote',
        component: ToolSyncRemotePage
    },
    {
        path: '/tool/about',
        name: 'tool-about',
        component: ToolAboutPage
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