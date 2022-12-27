import FileApi from "@/api/FileApi";
import router from '@/plugins/router';
import {ElMessage} from "element-plus";
import Entry from "@/global/Entry";
import LocalStorageUtil from "@/utils/LocalStorageUtil";

// ===== 配置文件 =====

// 设置相关
const SETTING_SERVER = 'setting-server.json';
const SETTING_BASIC = 'setting-basic.json';
const SETTING_IMAGE = 'setting-image.json';
const SETTING_SYNC_REMOTE = 'setting-sync-remote.json';
const SETTING_HINT = 'setting-hint.json';
const SETTING_SYNC_LOCAL = 'setting-sync-local.json';
const SETTING_SITE = 'setting-site.json';

// 数据相关
const DB_TAG = 'db-tag.json';
const DB_CATEGORY = 'db-category.json';
const DB_POST = 'db-post.json';
const DB_POST_TAG = 'db-post-tag.json';
const DB_POST_CATEGORY = 'db-post-category.json';
const DB_PAGE = 'db-page.json';
const DB_PAGE_TAG = 'db-page-tag.json';
const DB_PAGE_CATEGORY = 'db-page-category.json';
const DB_ENVIRONMENT = 'db-environment.json';

// hexo配置
const HEXO_CONFIG_BASE = '_config.base.yml';
const HEXO_CONFIG_EXTRA = '_config.extra.yml';

// localStorage
const LS_WORKSPACE = 'workspace';
const LS_WORKSPACE_HISTORY = 'workspace-history';
const LS_SITE = 'site';
const LS_ENVIRONMENT = 'environment';

// =====工作空间所有=====
// 配置
const CONFIG = '.config';
const SITE = 'site';
// =====站点所有=====
// 文章
const POST = 'posts';
// 页面
const PAGE = 'pages';
// 图片
const POST_IMAGES = 'post-images';
// 打包后的资源
const DIST = 'dist';
// 来源
const SOURCE = "source";
// git忽略文件
const GITIGNORE = ".gitignore";
// hexo
const HEXO = 'hexo';
const HEXO_CONFIG = '_config.yml';
const HEXO_THEME = 'themes';
const HEXO_PUBLIC = 'public';
const HEXO_PACKAGE_JSON = 'package.json';

// 文件内容

const CONTENT_WORKSPACE_GITIGNORE = 'dist';
const CONTENT_SITE_GITIGNORE = 'hexo/public\nhexo/node_modules\nhexo/source\nhexo/db.json';

// front-matter
const SEPARATE = '---';
const EXTRA = '# extra';
const EXPAND = '# expand';

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
    NAME: {
        POST: POST,
        POST_IMAGES: POST_IMAGES,
        PAGE: PAGE,
        CONFIG: CONFIG
    },
    FRONT_MATTER: {
        SEPARATE: SEPARATE,
        EXTRA: EXTRA,
        EXPAND: EXPAND
    },
    SETTING: {
        SERVER: SETTING_SERVER,
        BASIC: SETTING_BASIC,
        IMAGE: SETTING_IMAGE,
        SYNC_REMOTE: SETTING_SYNC_REMOTE,
        SYNC_LOCAL: SETTING_SYNC_LOCAL,
        SITE: SETTING_SITE
    },
    CONTENT: {
        GITIGNORE_WORKSPACE: CONTENT_WORKSPACE_GITIGNORE,
        GITIGNORE_SITE: CONTENT_SITE_GITIGNORE
    },
    HEXO: {
        NAME: HEXO,
        INIT: "init",
        INSTALL: "install",
        CLEAN: "clean",
        DEPLOY: "deploy",
        SERVER: "server",
        GENERATE: 'generate',
        FILE: {
            CONFIG: HEXO_CONFIG,
            THEME_CONFIG: (name: string) => {
                return `_config.${name}.yml`
            }
        },
    },
    LOCALSTORAGE: {
        WORKSPACE: LS_WORKSPACE,
        WORKSPACE_HISTORY: LS_WORKSPACE_HISTORY,
        SITE: LS_SITE,
        ENVIRONMENT: LS_ENVIRONMENT
    },
    FILE: {
        // 全局设置
        SETTING_SYNC_LOCAL: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), CONFIG, SETTING_SYNC_LOCAL);
        },
        SETTING_SITE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), CONFIG, SETTING_SITE);
        },
        GITIGNORE_WORKSPACE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), GITIGNORE);
        },
        // 站点设置
        GITIGNORE_SITE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, GITIGNORE);
        },
        SETTING_SERVER: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, SETTING_SERVER);
        },
        SETTING_BASIC: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, SETTING_BASIC);
        },
        SETTING_IMAGE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, SETTING_IMAGE);
        },
        SETTING_SYNC_REMOTE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, SETTING_SYNC_REMOTE);
        },
        SETTING_HINT: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, SETTING_HINT);
        },
        // 站点数据库存储
        DB_TAG: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, DB_TAG);
        },
        DB_CATEGORY: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, DB_CATEGORY);
        },
        DB_POST: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, DB_POST);
        },
        DB_POST_TAG: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, DB_POST_TAG);
        },
        DB_POST_CATEGORY: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, DB_POST_CATEGORY);
        },
        DB_PAGE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, DB_PAGE);
        },
        DB_PAGE_TAG: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, DB_PAGE_TAG);
        },
        DB_PAGE_CATEGORY: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, DB_PAGE_CATEGORY);
        },
        DB_ENVIRONMENT: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, DB_ENVIRONMENT);
        },
        // HEXO配置文件
        HEXO_CONFIG_BASE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, HEXO_CONFIG_BASE);
        },

        HEXO_CONFIG_EXTRA: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG, HEXO_CONFIG_EXTRA);
        },
        HEXO: {
            CONFIG: async (): Promise<string> => {
                return FileApi.resolve(workspaceDir(), SITE, siteDir().value, HEXO, HEXO_CONFIG);
            },
            PACKAGE_JSON: async (): Promise<string> => {
                return FileApi.resolve(workspaceDir(), SITE, siteDir().value, HEXO, HEXO_PACKAGE_JSON);
            }
        }
    },
    FOLDER: {
        // 基础工作空间
        WORKSPACE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir());
        },
        // 全局设置目录
        CONFIG: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), CONFIG);
        },
        // 站点基础设置目录
        SITE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE);
        },
        BASE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value);
        },
        SITE_CONFIG: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, CONFIG);
        },
        POST: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, POST);
        },
        PAGE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, PAGE);
        },
        POST_IMAGES: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, POST_IMAGES);
        },
        SOURCE: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, SOURCE);
        },
        DIST: async (): Promise<string> => {
            return FileApi.resolve(workspaceDir(), SITE, siteDir().value, DIST);
        },
        HEXO: {
            BASE: async (): Promise<string> => {
                return FileApi.resolve(workspaceDir(), SITE, siteDir().value, HEXO);
            },
            THEME: async (): Promise<string> => {
                return FileApi.resolve(workspaceDir(), SITE, siteDir().value, HEXO, HEXO_THEME);
            },
            PUBLIC: async (): Promise<string> => {
                return FileApi.resolve(workspaceDir(), SITE, siteDir().value, HEXO, HEXO_PUBLIC);
            }
        },
    },
}