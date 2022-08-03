import InvokeArgs from "@/api/entities/InvokeArgs";
import {invoke} from "@tauri-apps/api/tauri";
import {open} from "@tauri-apps/api/shell";

/**
 * 原生方法
 */
export default {

    invoke(cmd: string, args?: InvokeArgs): Promise<void> {
        return invoke(cmd, args);
    },

    open(path: string, openWith?: string): Promise<void> {
        return open(path, openWith)
    }

}