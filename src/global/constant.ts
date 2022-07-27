import {documentDir, resolve} from "@tauri-apps/api/path";

let document = await documentDir();

// 基础
const BASE = 'yun-luo-blog';
const BASE_PATH = await resolve(document, BASE);
// 文章
const POST = 'posts';
const POST_PATH = await resolve(BASE_PATH, POST);
// 配置
const CONFIG = '.config';
const CONFIG_PATH = await resolve(BASE_PATH, CONFIG);
// 图片
const POST_IMAGES = 'post-images';
const POST_IMAGES_PATH = await resolve(BASE_PATH, POST_IMAGES);
// hexo
const HEXO = 'hexo';
const HEXO_PATH = await resolve(BASE_PATH, HEXO);
const HEXO_CONFIG = '_config.yml';
const HEXO_CONFIG_PATH = await resolve(HEXO_PATH, HEXO_CONFIG);

export default {
    BASE: BASE,
    POST: POST,
    CONFIG: CONFIG,
    HEXO: HEXO,
    POST_IMAGES: POST_IMAGES,
    PACKAGE_JSON: 'package.json',
    PATH: {
        BASE: BASE_PATH,
        POST: POST_PATH,
        CONFIG: CONFIG_PATH,
        POST_IMAGES: POST_IMAGES_PATH,
        HEXO: HEXO_PATH,
        HEXO_CONFIG: HEXO_CONFIG_PATH
    }
}