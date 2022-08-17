import {ElLoading, ElMessageBox} from "element-plus";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import NativeApi from "@/api/NativeApi";
import StrUtil from "@/utils/StrUtil";
import TerminalStack from "@/entities/TerminalStack";
import {settingService} from "@/global/BeanFactory";

export default class HexoService {

    terminalStackMap: Map<number, TerminalStack> = new Map<number, TerminalStack>();

    async isInit(): Promise<boolean> {
        let items = await FileApi.listDir(await Constant.FOLDER.HEXO());
        return Promise.resolve(items.length > 0);
    }

    async getHexoCommandPath(): Promise<string> {
        let hexoCommandPath = settingService.getEnvironment().hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<string>((resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        return Promise.resolve(hexoCommandPath);
    }

    async getNpmCommandPath(): Promise<string> {
        let npmCommandPath = settingService.getEnvironment().npmPath;
        if (!npmCommandPath || npmCommandPath === "") {
            return new Promise<string>((resolve, reject) => {
                reject("请配置npm命令路径");
            })
        }
        return Promise.resolve(npmCommandPath);
    }

    getTerminalStackMap(): Map<number, TerminalStack> {
        return this.terminalStackMap;
    }

    clearTerminalStack(): void {
        this.terminalStackMap.clear();
    }

    async init(): Promise<void> {
        const loading = ElLoading.service({
            lock: true,
            text: '开始初始化',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            // 获取hexo目录
            let hexoPath = await Constant.FOLDER.HEXO();
            loading.setText("重置目录");
            // 先删除旧的目录
            await FileApi.removeDir(hexoPath);
            // 创建新的目录
            await FileApi.createDir(hexoPath);
            loading.setText("执行初始化命令");
            // 执行初始化命令
            let terminalStack = {
                id: new Date().getTime(),
                name: "初始化",
                command: Constant.HEXO.INIT,
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

    async clean(): Promise<void> {
        if (!(await this.isInit())) {
            return Promise.reject("博客未初始化，请初始化后重试")
        }
        // 获取hexo命令目录
        const loading = ElLoading.service({
            lock: true,
            text: '开始清理',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        let terminalStack = {
            id: new Date().getTime(),
            name: "清理",
            command: Constant.HEXO.CLEAN,
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

    async install(): Promise<void> {
        if (!(await this.isInit())) {
            return Promise.reject("博客未初始化，请初始化后重试")
        }
        // 获取hexo命令目录
        const loading = ElLoading.service({
            lock: true,
            text: '开始安装',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            let terminalStack = {
                id: new Date().getTime(),
                name: "部署",
                command: Constant.HEXO.INSTALL,
                run: true,
                success: true,
                time: new Date(),
                show: true,
                contents: []
            }
            await this.runCommand(terminalStack, await this.getNpmCommandPath())
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

    async runCommand(terminalStack: TerminalStack, command?: string): Promise<void> {
        this.getTerminalStackMap().set(terminalStack.id, terminalStack);
        let hexoPath = await Constant.FOLDER.HEXO();
        let hexoCommandPath = command ? command : await this.getHexoCommandPath();
        let temp = terminalStack;
        return NativeApi.invokeSpawn({
            command: hexoCommandPath,
            currentDir: hexoPath,
            args: terminalStack.command,
            out: (event, data) => {
                let terminalStack = this.terminalStackMap.get(temp.id)!;
                terminalStack.contents.push(this.replaceLog(StrUtil.uint8ArrayToString(data)));
            },
            err: (event, data) => {
                let terminalStack = this.terminalStackMap.get(temp.id)!;
                terminalStack.contents.push("<span style='color: red;'>" +
                    this.replaceLog(StrUtil.uint8ArrayToString(data)) +
                    "</span>");
            },
            exit: (event, data) => {
                let terminalStack = this.terminalStackMap.get(temp.id)!;
                terminalStack.run = false;
                terminalStack.contents.push(this.replaceLog(StrUtil.uint8ArrayToString(data)));
            }
        });
    }

    private replaceLog(log: string): string {
        return log.replaceAll("\n", "</p><p>")
            .replaceAll("[24m", "")
            .replaceAll("[32m", "")
            .replaceAll("[33m", "")
            .replaceAll("[35m", "")
            .replaceAll("[36m", "")
            .replaceAll("[39m", "")
            .replaceAll("[43m", "")
            .replaceAll("[4m", "")
            .replaceAll("[41m", "")
            .replaceAll("[49m", "")
            .replaceAll("[2K", "")
            .replaceAll("[1G", "")
    }

}