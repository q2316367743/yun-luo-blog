import Result from "@/global/Result";


const {ipcRenderer} = window.require('electron');

export default {

    async openDevTools(): Promise<void> {
        let result = (await ipcRenderer.invoke('application:openDevTools', {})) as Result<any>;
        if (result.code) {
            return new Promise<void>(resolve => {
                resolve(result.data);
            });
        } else {
            return new Promise<void>((resolve1, reject) => {
                reject(result.message)
            })
        }
    }

}