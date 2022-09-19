import HintSetting from "@/entities/setting/HintSetting";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import ObjectUtil from "@/utils/ObjectUtil";
import {ElNotification} from "element-plus";

let hintSetting = {
    localImage: true,
    updateServerStart: false,
    updateServerComplete: false,
    updateServerError: true
} as HintSetting;

export default class HintService {

    private hintSetting: HintSetting;

    constructor() {
        this.hintSetting = hintSetting;
    }

    async init(): Promise<void> {
        // 初始化
        let path = await Constant.FILE.SETTING_HINT();
        // 读取文件
        let source = {}
        if (await FileApi.exist(path)) {
            try {
                let content = await FileApi.readFile(path);
                source = JSON.parse(content);
            } catch (e) {
                console.error(e);
            }
        }
        this.hintSetting = ObjectUtil.assignWithTarget(source, hintSetting);
    }

    getHintSetting(): HintSetting {
        return this.hintSetting;
    }

    async setHintSetting(hintSetting: HintSetting): Promise<void> {
        let path = await Constant.FILE.SETTING_HINT();
        return new Promise<void>(resolve => {
            FileApi.writeFile(path, JSON.stringify(hintSetting)).then(() => {
                this.hintSetting = hintSetting;
                resolve();
            })
        });
    }

    localImage(): void {
        console.log(this.hintSetting)
        if (this.hintSetting.localImage) {
            ElNotification({
                title: '建议配置图床',
                message: '检测到未配置图床，建议配置图床使用',
                type: 'warning',
            });
        }
    }

    updateServerStart(): void {
        if (this.hintSetting.updateServerStart) {
            ElNotification({
                title: '服务器更新',
                message: '资源已更新，服务器更新开始',
                type: 'info',
            });
        }
    }

    updateServerComplete(): void {
        if (this.hintSetting.updateServerComplete) {
            ElNotification({
                title: '服务器更新',
                message: '资源已更新，服务器更新完成',
                type: 'success',
            });
        }
    }

    updateServerError(e: Error): void {
        if (this.hintSetting.updateServerError) {
            ElNotification({
                title: '服务器更新',
                message: '服务器资源更新错误，' + e,
                type: 'error',
            });
        }
    }

}