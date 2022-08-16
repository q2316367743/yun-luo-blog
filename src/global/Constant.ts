import FileApi from "@/api/FileApi";

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

/**
 * 获取项目基础目录
 */
async function basicDir(): Promise<string> {
    let basePath = localStorage.getItem('basePath');
    if (!basePath) {
        basePath = await FileApi.defaultDir();
        localStorage.setItem('basePath', basePath);
    }
    return Promise.resolve(basePath);
}

export default {
    BASE: BASE,
    POST: POST,
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
        CLEAN: "clean",
        DEPLOY: "deploy",
        SERVER: "server"
    },
    POST_IMAGES: POST_IMAGES,
    HEXO_THEME: HEXO_THEME,
    FILE: {
        GITIGNORE: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, GITIGNORE);
        },
        SETTING_SERVER: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, CONFIG, SETTING_SERVER);
        },
        SETTING_BASIC: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, CONFIG, SETTING_BASIC);
        },
        SETTING_IMAGE: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, CONFIG, SETTING_IMAGE);
        },
        SETTING_ENVIRONMENT: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, CONFIG, SETTING_ENVIRONMENT);
        },
        SETTING_SYNC_REMOTE: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, CONFIG, SETTING_SYNC_REMOTE);
        },
        SETTING_SYNC_LOCAL: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, CONFIG, SETTING_SYNC_LOCAL);
        }
    },
    FOLDER: {
        BASE: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE);
        },
        POST: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, POST);
        },
        CONFIG: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, CONFIG);
        },
        POST_IMAGES: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, POST_IMAGES);
        },
        DIST: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, DIST);
        },
        HEXO: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, HEXO);
        },
        HEXO_CONFIG: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, HEXO, HEXO_CONFIG);
        },
        HEXO_THEME: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, HEXO, HEXO_THEME);
        },
        HEXO_PUBLIC: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, HEXO, HEXO_PUBLIC);
        },
        HEXO_PACKAGE_JSON: async (): Promise<string> => {
            let document = await basicDir();
            return FileApi.resolve(document, BASE, HEXO, HEXO_PACKAGE_JSON);
        }
    },
}