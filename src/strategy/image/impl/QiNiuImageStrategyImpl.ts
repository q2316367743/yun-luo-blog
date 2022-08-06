import ImageStrategy from "@/strategy/image/ImageStrategy";
import {useSettingStore} from "@/store/SettingStore";
import qiniu from 'qiniu-js';

export default class QiNiuImageStrategyImpl implements ImageStrategy {

    upload(): Promise<string> {
        return Promise.reject("暂不支持")
        // 获取七牛云配置信息
        // http(s)://up.qiniup.com
        let image = useSettingStore().image;
        let storageArea = image.qiNiu.storageArea;
        if (!storageArea || storageArea === "") {
            return Promise.reject("存储空间未设置");
        }
        if (storageArea === "z0") {
            // 华中区域不需要
            storageArea = "";
        }else {
            // 其他区域加横杠
            storageArea = "-" + storageArea;
        }
        return Promise.resolve("");
    }

    parse(url: string): string {
        return url;
    }

}