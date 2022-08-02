import {invoke} from "@tauri-apps/api/tauri";
import Constant from "@/global/Constant";

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
        let hexoPath = await Constant.PATH.HEXO();
        await invoke("command_run", {
            command: "C:\\WINDOWS\\system32\\cmd.exe",
            arg: ["/c", "start", `D:\\Program Files\\nodejs\\node_global\\hexo.cmd`, "init"].join(" "),
            currentDir: hexoPath
        });
        return new Promise<void>((resolve) => {
            resolve();
        });
    },

    /**
     * 清理缓存
     */
    async clean(): Promise<void> {
        let hexoPath = await Constant.PATH.HEXO();
        await invoke('command_run', {
            command: "D:\\Program Files\\nodejs\\node_global\\hexo.cmd",
            arg: "clean",
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
        let hexoPath = await Constant.PATH.HEXO();
        await invoke('command_run', {
            command: "D:\\Program Files\\nodejs\\node_global\\hexo.cmd",
            arg: "d",
            currentDir: hexoPath
        });
        return new Promise<void>((resolve) => {
            resolve();
        });
    }


}