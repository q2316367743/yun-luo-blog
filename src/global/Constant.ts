import {documentDir, resolve} from "@tauri-apps/api/path";

let document = "";

// 基础
const BASE = 'yun-luo-blog';
// 文章
const POST = 'posts';
// 配置
const CONFIG = '.config';
// 图片
const POST_IMAGES = 'post-images';
// hexo
const HEXO = 'hexo';
const HEXO_CONFIG = '_config.yml';
const HEXO_THEME = 'themes';

export default {
    BASE: BASE,
    POST: POST,
    CONFIG: CONFIG,
    HEXO: {
        NAME: HEXO,
        INIT: "init",
        CLEAN: "clean",
        DEPLOY: "deploy"
    },
    POST_IMAGES: POST_IMAGES,
    HEXO_THEME: HEXO_THEME,
    PATH: {
        BASE: async (): Promise<string> => {
            let document = await documentDir();
            return resolve(document, BASE);
        },
        POST: async (): Promise<string> => {
            let document = await documentDir();
            return resolve(document, BASE, POST);
        },
        CONFIG: async (): Promise<string> => {
            let document = await documentDir();
            return resolve(document, BASE, CONFIG);
        },
        POST_IMAGES: async (): Promise<string> => {
            let document = await documentDir();
            return resolve(document, BASE, POST_IMAGES);
        },
        HEXO: async (): Promise<string> => {
            let document = await documentDir();
            return resolve(document, BASE, HEXO);
        },
        HEXO_CONFIG: async (): Promise<string> => {
            let document = await documentDir();
            return resolve(document, BASE, HEXO, HEXO_CONFIG);
        },
        HEXO_THEME: async (): Promise<string> => {
            let document = await documentDir();
            return resolve(document, BASE, HEXO, HEXO_THEME);
        }
    },
}