import { documentDir, resolve } from "@tauri-apps/api/path";

let document = await documentDir();

const BASE = 'yun-luo-blog';
const BASE_PATH = await resolve(document, BASE);
const POST = 'posts';
const POST_PATH = await resolve(BASE_PATH, POST);
const HEXO = 'hexo';
const HEXO_PATH = await resolve(BASE_PATH, HEXO);
const HEXO_CONFIG = '_config.yml';
const HEXO_CONFIG_PATH = await resolve(HEXO_PATH, HEXO_CONFIG);

export default {
    BASE: BASE,
    POST: POST,
    CONFIG: '.config',
    HEXO: HEXO,
    POST_IMAGES: 'post-images',
    PACKAGE_JSON: 'package.json',
    PATH: {
        BASE: BASE_PATH,
        POSY: POST_PATH,
        HEXO: HEXO_PATH,
        HEXO_CONFIG: HEXO_CONFIG_PATH
    }
}