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
    async init(): Promise<void>{
        const loading = ElLoading.service({
            lock: true,
            text: '开始初始化',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        // 获取hexo命令目录
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<void>((resolve, reject) => {
                loading.close();
                reject("请配置hexo命令路径");
            })
        }
        // 获取hexo目录
        let hexoPath = await Constant.PATH.HEXO();
        loading.setText("重置目录");
        // 先删除旧的目录
        await FileApi.removeDir(hexoPath);
        // 创建新的目录
        await FileApi.createDir(hexoPath);
        loading.setText("执行初始化命令");
        // 执行初始化命令
        await NativeApi.invoke("command_run", {
            command: hexoCommandPath,
            arg: Constant.HEXO.INIT,
            currentDir: hexoPath
        });
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
        let hexoPath = await Constant.PATH.HEXO();
        await NativeApi.invoke('command_run', {
            command: hexoCommandPath,
            arg: Constant.HEXO.CLEAN,
            currentDir: hexoPath
        });
        return new Promise<void>((resolve) => {
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
        let hexoPath = await Constant.PATH.HEXO();
        await NativeApi.invoke('command_run', {
            command: hexoCommandPath,
            arg: Constant.HEXO.DEPLOY,
            currentDir: hexoPath
        });
        return new Promise<void>((resolve) => {
            resolve();
        });
    }


}