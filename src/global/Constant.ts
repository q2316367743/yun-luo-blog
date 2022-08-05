import FileApi from "@/api/FileApi";

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
// hexo
const HEXO = 'hexo';
const HEXO_CONFIG = '_config.yml';
const HEXO_THEME = 'themes';
const HEXO_PUBLIC = 'public';

/**
 * 获取项目基础目录
 */
function basicDir(): Promise<string> {
    // 此处返回默认目录
    return FileApi.defaultDir();
}

export default {
    BASE: BASE,
    POST: POST,
    CONFIG: CONFIG,
    HEXO: {
        NAME: HEXO,
        INIT: "init",
        CLEAN: "clean",
        DEPLOY: "deploy",
        SERVER: "server"
    },
    POST_IMAGES: POST_IMAGES,
    HEXO_THEME: HEXO_THEME,
    PATH: {
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
    },
}