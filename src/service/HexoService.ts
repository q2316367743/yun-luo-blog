import {useSettingStore} from "@/store/SettingStore";
import {ElLoading, ElMessageBox} from "element-plus";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import NativeApi from "@/api/NativeApi";
import StrUtil from "@/utils/StrUtil";
import TerminalStack from "@/entities/TerminalStack";

export default class HexoService {

    terminalStackMap: Map<number, TerminalStack> = new Map<number, TerminalStack>();

    async isInit(): Promise<boolean> {
        let items = await FileApi.listDir(await Constant.PATH.HEXO());
        return Promise.resolve(items.length > 0);
    }

    async getHexoCommandPath(): Promise<string> {
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<string>((resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        return Promise.resolve(hexoCommandPath);
    }

    getTerminalStackMap(): Map<number, TerminalStack> {
        return this.terminalStackMap;
    }

    async init(): Promise<void> {
        // 获取hexo命令目录
        let hexoCommandPath = await this.getHexoCommandPath();
        const loading = ElLoading.service({
            lock: true,
            text: '开始初始化',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
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
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            loading.close();
        }
    }

    async clean(): Promise<void> {
        if (!(await this.isInit())) {
            return Promise.reject("博客未初始化，请初始化后重试")
        }
        // 获取hexo命令目录
        let hexoCommandPath = await this.getHexoCommandPath();
        const loading = ElLoading.service({
            lock: true,
            text: '开始清理',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        let id = new Date().getTime();
        this.terminalStackMap.set(id, {
            id: id,
            name: "清理",
            command: Constant.HEXO.SERVER,
            run: true,
            success: true,
            time: new Date(),
            show: true,
            contents: []
        });
        try {
            let hexoPath = await Constant.PATH.HEXO();
            await NativeApi.invokeCmd(hexoCommandPath, hexoPath, Constant.HEXO.CLEAN);
            return new Promise<void>((resolve) => {
                loading.close();
                resolve();
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            loading.close();
        }
    }

    async server(): Promise<void> {
        if (!(await this.isInit())) {
            return Promise.reject("博客未初始化，请初始化后重试")
        }
        // 获取hexo命令目录
        let hexoCommandPath = await this.getHexoCommandPath();
        const loading = ElLoading.service({
            lock: true,
            text: '开始运行',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        let terminalStack = {
            id: new Date().getTime(),
            name: "运行",
            command: Constant.HEXO.SERVER,
            run: true,
            success: true,
            time: new Date(),
            show: true,
            contents: []
        }
        try {
            await this.runCommand(terminalStack)
            return new Promise<void>((resolve) => {
                loading.close();
                ElMessageBox.confirm(
                    '程序运行成功，是否打开网页',
                    '成功', {
                        confirmButtonText: '打开',
                        cancelButtonText: '取消',
                        type: 'success',
                    }
                ).then(() => {
                    NativeApi.openUrl("http://localhost:4000");
                }).catch(() => {
                })
                resolve();
            });
        } catch (e) {
            this.terminalStackMap.get(terminalStack.id)!.success = false;
            console.error(e);
            return Promise.reject(e);
        }
    }

    async deploy(): Promise<void> {
        if (!(await this.isInit())) {
            return Promise.reject("博客未初始化，请初始化后重试")
        }
        // 获取hexo命令目录
        const loading = ElLoading.service({
            lock: true,
            text: '开始打包',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            let terminalStack = {
                id: new Date().getTime(),
                name: "部署",
                command: Constant.HEXO.DEPLOY,
                run: true,
                success: true,
                time: new Date(),
                show: true,
                contents: []
            }
            await this.runCommand(terminalStack)
            return new Promise<void>((resolve) => {
                loading.close();
                resolve();
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            loading.close();
        }
    }

    async runCommand(terminalStack: TerminalStack): Promise<void> {
        this.getTerminalStackMap().set(terminalStack.id, terminalStack);
        let hexoPath = await Constant.PATH.HEXO();
        let hexoCommandPath = await this.getHexoCommandPath();
        let temp = terminalStack;
        return NativeApi.invokeAsync({
            id: terminalStack.id,
            command: hexoCommandPath,
            currentDir: hexoPath,
            args: terminalStack.command,
            out: (event, data) => {
                let terminalStack = this.terminalStackMap.get(temp.id)!;
                terminalStack.contents.push("日志：" + StrUtil.uint8ArrayToString(data).replaceAll("\n", "<br />"));
            },
            err: (event, data) => {
                let terminalStack = this.terminalStackMap.get(temp.id)!;
                terminalStack.contents.push("错误：" + StrUtil.uint8ArrayToString(data).replaceAll("\n", "<br />"));
            },
            exit: (event, data) => {
                let terminalStack = this.terminalStackMap.get(temp.id)!;
                terminalStack.run = false;
                terminalStack.contents.push("退出：" + StrUtil.uint8ArrayToString(data).replaceAll("\n", "<br />"));
            }
        });
    }

}