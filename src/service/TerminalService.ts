import TerminalStack from "@/entities/TerminalStack";
import NativeApi from "@/api/NativeApi";
import StrUtil from "@/utils/StrUtil";
import CommandSyncOptions from "@/api/entities/CommandSyncOptions";

export default class TerminalService {

    terminalStackMap: Map<number, TerminalStack> = new Map<number, TerminalStack>();

    getTerminalStackMap(): Map<number, TerminalStack> {
        return this.terminalStackMap;
    }

    /**
     * 终端终端任务
     *
     * @param name 任务名称
     * @param options 参数
     * @param success 成功时回调
     */
    async add(name: string, options: CommandSyncOptions, success?: () => void): Promise<number> {
        let id = new Date().getTime();
        NativeApi.invokeSpawn({
            id: id,
            command: options.command,
            currentDir: options.currentDir,
            args: options.args,
            out: (event, data) => {
                let terminalStack = this.terminalStackMap.get(id)!;
                terminalStack.contents.push(this.replaceLog(StrUtil.uint8ArrayToString(data)));
            },
            err: (event, data) => {
                let terminalStack = this.terminalStackMap.get(id)!;
                terminalStack.contents.push("<span style='color: red;'>" +
                    this.replaceLog(StrUtil.uint8ArrayToString(data)) +
                    "</span>");
            },
            exit: (event, data) => {
                let terminalStack = this.terminalStackMap.get(id)!;
                terminalStack.run = false;
                terminalStack.contents.push(this.replaceLog(StrUtil.uint8ArrayToString(data)));
                if (success) {
                    success();
                }
            }
        }).then(() => {
            console.log('运行成功')
        });
        // 重新复制
        let terminalStack = {
            id: id,
            command: options.command,
            run: true,
            success: true,
            time: new Date(),
            show: true,
            name: name,
            contents: []
        } as TerminalStack;
        this.getTerminalStackMap().set(id, terminalStack);
        return Promise.resolve(id);
    }

    async kill(id: number): Promise<void> {
        return NativeApi.kill(id);
    }

    clean(): void {
        let terminalStackMap = new Map<number, TerminalStack>();
        this.terminalStackMap.forEach((value, key) => {
            if (value.run) {
                // 仅保存运行中的
                terminalStackMap.set(key, value);
            }
        });
        this.terminalStackMap = terminalStackMap;
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