import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

import LoadingPage from '@/pages/loading/index.vue';
import WorkspacePage from "@/pages/workspace/index.vue";
import SitePage from '@/pages/site/index.vue';
import PostListPage from '@/pages/postList/index.vue';
import PostEditPage from '@/pages/postEdit/index.vue';
import PageListPage from '@/pages/pageList/index.vue';
import TagPage from '@/pages/tag/index.vue';
import CategoryPage from "@/pages/category/index.vue";

import PrettyHexoPage from '@/pages/pretty/hexo/index.vue';
import PrettyHexoThemeList from "@/pages/pretty/hexo/components/ThemeList.vue";
import PrettyHexoThemeEditor from "@/pages/pretty/hexo/components/ThemeEditor.vue";
import PrettyHexoFileManage from "@/pages/pretty/hexo/components/FileManage.vue";
import PrettyHexoPlugin from "@/pages/pretty/hexo/components/PluginList.vue";

import ConfigHexoPage from '@/pages/config/hexo/index.vue';

import ToolPage from '@/pages/tool/index.vue';
import ToolImportPage from '@/pages/tool/pages/import.vue';
import ToolBackupPage from '@/pages/tool/pages/backup.vue';
import ToolSyncRemotePage from '@/pages/tool/pages/sync-remote.vue';
import ToolAboutSelfPage from '@/pages/about/index.vue';
import ToolAboutLicensePage from '@/pages/about/license.vue';
import ToolAboutOpenSourcePage from '@/pages/about/openSource.vue';

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
        path: '/post/list',
        name: 'post-list',
        component: PostListPage
    },
    {
        path: '/post/edit',
        name: 'post-edit',
        component: PostEditPage
    },
    {
        path: '/page/list',
        name: 'page-list',
        component: PageListPage
    },
    {
        path: '/page/edit',
        name: 'page-edit',
        component: PostEditPage
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
        component: PrettyHexoPage,
        redirect: '/pretty/hexo/theme',
        children: [
            {
                path: 'theme',
                name: 'pretty-hexo-theme',
                component: PrettyHexoThemeList
            },
            {
                path: 'theme-editor',
                name: 'pretty-hexo-theme-editor',
                component: PrettyHexoThemeEditor
            },
            {
                path: 'file-manage',
                name: 'pretty-hexo-file-manage',
                component: PrettyHexoFileManage
            },
            {
                path: 'plugin',
                name: 'pretty-hexo-plugin',
                component: PrettyHexoPlugin
            },
            {
                path: 'source-manage',
                name: 'pretty-hexo-source-manage',
                component: PrettyHexoFileManage
            }
        ]
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
        path: '/tool/about/self',
        name: 'tool-about-self',
        component: ToolAboutSelfPage
    },
    {
        path: '/tool/about/license',
        name: 'tool-about-license',
        component: ToolAboutLicensePage
    },
    {
        path: '/tool/about/openSource',
        name: 'tool-about-openSource',
        component: ToolAboutOpenSourcePage
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