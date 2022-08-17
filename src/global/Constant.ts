import FileApi from "@/api/FileApi";
import router from '@/plugins/router';
import {ElMessage} from "element-plus";
import Entry from "@/global/Entry";
import LocalStorageUtil from "@/utils/LocalStorageUtil";

// 文件

// 设置相关
const SETTING_SERVER = 'setting-server.json';
const SETTING_BASIC = 'setting-basic.json';
const SETTING_IMAGE = 'setting-image.json';
const SETTING_ENVIRONMENT = 'setting-environment.json';
const SETTING_SYNC_REMOTE = 'setting-sync-remote.json';
const SETTING_SYNC_LOCAL = 'setting-sync-local.json';

// 数据相关
const DB_TAG = 'db-tag.json';
const DB_CATEGORY = 'db-category.json';
const DB_POST = 'db-post.json';
const DB_POST_TAG = 'db-post-tag.json';
const DB_POST_CATEGORY = 'db-post-category.json';

// 文件夹

// 基础
const BASE = 'yun-luo-blog';
// 文章
const POST = 'posts';
// 配置
const CONFIG = '.config';
// 图片
const POST_IMAGES = 'post-images';
// 打包后的资源
const DIST = 'dist';
// git忽略文件
const GITIGNORE = ".gitignore";
// hexo
const HEXO = 'hexo';
const HEXO_CONFIG = '_config.yml';
const HEXO_THEME = 'themes';
const HEXO_PUBLIC = 'public';
const HEXO_PACKAGE_JSON = 'package.json';

// 文件内容

const CONTENT_GITIGNORE = `dist
hexo/public
hexo/node_modules`;

// localStorage
const LS_WORKSPACE = 'workspace';
const LS_WORKSPACE_HISTORY = 'workspace-history';
const LS_SITE = 'site';
const LS_SITE_HISTORY = 'site-history';

/**
 * 获取工作空间目录
 */
function workspaceDir(): string {
    let workspace = localStorage.getItem(LS_WORKSPACE);
    if (!workspace) {
        router.push('/loading').then(() => {
            ElMessage({
                showClose: true,
                type: 'error',
                message: '工作空间获取错误'
            })
        });
    }
    return workspace!;
}

/**
 * 获取站点目录
 */
function siteDir(): Entry {
    let siteDir = LocalStorageUtil.get(LS_SITE);
    if (!siteDir) {
        router.push('/loading').then(() => {
            ElMessage({
                showClose: true,
                type: 'error',
                message: '站点目录获取错误'
            })
        });
    }
    return siteDir;
}

export default {
    POST_IMAGES: POST_IMAGES,
    SETTING: {
        SERVER: SETTING_SERVER,
        BASIC: SETTING_BASIC,
        IMAGE: SETTING_IMAGE,
        SYNC_REMOTE: SETTING_SYNC_REMOTE,
        SYNC_LOCAL: SETTING_SYNC_LOCAL,
        ENVIRONMENT: SETTING_ENVIRONMENT
    },
    CONTENT: {
        GITIGNORE: CONTENT_GITIGNORE
    },
    HEXO: {
        NAME: HEXO,
        INIT: "init",
        INSTALL: "install",
        CLEAN: "clean",
        DEPLOY: "deploy",
        SERVER: "server"
    },
    LOCALSTORAGE: {
        WORKSPACE: LS_WORKSPACE,
        WORKSPACE_HISTORY: LS_WORKSPACE_HISTORY,
        SITE: LS_SITE,
        SITE_HISTORY: LS_SITE_HISTORY
    },
    FILE: {
        GITIGNORE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, GITIGNORE);
        },
        SETTING_SERVER: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, CONFIG, SETTING_SERVER);
        },
        SETTING_BASIC: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, CONFIG, SETTING_BASIC);
        },
        SETTING_IMAGE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, CONFIG, SETTING_IMAGE);
        },
        SETTING_ENVIRONMENT: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, CONFIG, SETTING_ENVIRONMENT);
        },
        SETTING_SYNC_REMOTE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, CONFIG, SETTING_SYNC_REMOTE);
        },
        SETTING_SYNC_LOCAL: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, CONFIG, SETTING_SYNC_LOCAL);
        },
        DB_TAG: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, CONFIG, DB_TAG);
        },
        DB_CATEGORY: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, CONFIG, DB_CATEGORY);
        },
        DB_POST: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, CONFIG, DB_POST);
        },
        DB_POST_TAG: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, CONFIG, DB_POST_TAG);
        },
        DB_POST_CATEGORY: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, CONFIG, DB_POST_CATEGORY);
        }
    },
    FOLDER: {
        workspaceDir,
        siteDir,
        CONFIG: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, CONFIG);
        },
        BASE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value);
        },
        POST: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, POST);
        },
        SITE_CONFIG: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, CONFIG);
        },
        POST_IMAGES: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, POST_IMAGES);
        },
        DIST: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, DIST);
        },
        HEXO: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, HEXO);
        },
        HEXO_CONFIG: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, HEXO, HEXO_CONFIG);
        },
        HEXO_THEME: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, HEXO, HEXO_THEME);
        },
        HEXO_PUBLIC: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, HEXO, HEXO_PUBLIC);
        },
        HEXO_PACKAGE_JSON: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), BASE, siteDir().value, HEXO, HEXO_PACKAGE_JSON);
        }
    },
}