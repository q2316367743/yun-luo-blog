import ImageStrategy from "@/strategy/image/ImageStrategy";
import {useSettingStore} from "@/store/SettingStore";
import HttpApi from "@/api/HttpApi";

/**
 * PicGo响应体
 */
interface PicGoResult {

    /**
     * 是否成功
     */
    success: boolean;

    /**
     * 新的文件地址
     */
    list: Array<string>;

}

export default class PicGoImageStrategyImpl implements ImageStrategy {

    async upload(path: string): Promise<string> {
        let imageSetting = useSettingStore().imageSetting;
        let axiosPromise = await HttpApi.native<PicGoResult>({
            method: 'POST',
            url: `http://${imageSetting.picGo.address}:${imageSetting.picGo.port}/upload`,
            data: {
                list: [path]
            }
        });
        return new Promise<string>(resolve => {
            resolve(axiosPromise.data.list[0]);
        });
    }

    parse(url: string): string {
        return url;
    }

}