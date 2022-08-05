import ImageStrategy from "@/strategy/image/ImageStrategy";
import {useSettingStore} from "@/store/SettingStore";
import NativeApi from "@/api/NativeApi";

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
        let imageSetting = useSettingStore().image;
        let response = await NativeApi.http<PicGoResult>({
            url: `http://${imageSetting.picGo.address}:${imageSetting.picGo.port}`,
            method: "GET",
            data: {
                list: [path]
            }
        });
        return new Promise<string>(resolve => {
            resolve(response.list[0]);
        });
    }

    parse(url: string): string {
        return url;
    }

}