import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import {useSettingStore} from "@/store/SettingStore";
import {ElLoading} from "element-plus";
import NativeApi from "@/api/NativeApi";

let packageJson = `{
  "name": "hexo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}`;

/**
 * Hexo工具类
 */
export default {

    /**
     * Hexo初始化
     */
    async init(): Promise<void> {
        // 获取hexo命令目录
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<void>((resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        const loading = ElLoading.service({
            lock: true,
            text: '开始初始化',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        // 获取hexo目录
        let hexoPath = await Constant.PATH.HEXO();
        loading.setText("重置目录");
        // 先删除旧的目录
        await FileApi.removeDir(hexoPath);
        // 创建新的目录
        await FileApi.createDir(hexoPath);
        loading.setText("执行初始化命令");
        // 执行初始化命令
        await NativeApi.invokeCmd(hexoCommandPath, hexoPath, Constant.HEXO.INIT);
        return new Promise<void>((resolve) => {
            loading.close();
            resolve();
        });
    },

    /**
     * 清理缓存
     */
    async clean(): Promise<void> {
        // 获取hexo命令目录
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<void>((resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        const loading = ElLoading.service({
            lock: true,
            text: '开始清理',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        let hexoPath = await Constant.PATH.HEXO();
        await NativeApi.invokeCmd(hexoCommandPath, hexoPath, Constant.HEXO.CLEAN);
        return new Promise<void>((resolve) => {
            loading.close();
            resolve();
        });
    },

    async server(): Promise<void> {
        // 获取hexo命令目录
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<void>((resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        const loading = ElLoading.service({
            lock: true,
            text: '开始运行',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        let hexoPath = await Constant.PATH.HEXO();
        await NativeApi.invokeAsync(hexoCommandPath, hexoPath, Constant.HEXO.SERVER);
        return new Promise<void>((resolve) => {
            loading.close();
            resolve();
        });
    },

    /**
     * 项目部署
     */
    async deploy(): Promise<void> {
        // 获取hexo命令目录
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<void>((resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        const loading = ElLoading.service({
            lock: true,
            text: '开始打包',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        let hexoPath = await Constant.PATH.HEXO();
        await NativeApi.invokeCmd(hexoCommandPath, hexoPath, Constant.HEXO.DEPLOY);
        return new Promise<void>((resolve) => {
            loading.close();
            resolve();
        });
    }


}