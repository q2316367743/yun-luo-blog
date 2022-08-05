import OpenDialogOptions from "@/api/entities/OpenDialogOptions";
import Result from "@/global/Result";
import {ElLoading} from "element-plus";

const {ipcRenderer} = window.require('electron');


export default {

    async open(options: OpenDialogOptions): Promise<null | string | string[]> {
        const loading = ElLoading.service({
            lock: true,
            text: '选择文件',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        let result = (await ipcRenderer.invoke('dialog:open', options)) as Result<any>;
        if (result.code) {
            return new Promise<null | string | string[]>(resolve => {
                loading.close();
                resolve(result.data);
            });
        } else {
            return new Promise<null | string | string[]>((resolve1, reject) => {
                loading.close();
                reject(result.message)
            })
        }
    }

}