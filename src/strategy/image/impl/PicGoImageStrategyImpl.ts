import ImageStrategy from "@/strategy/image/ImageStrategy";
import {useSettingStore} from "@/store/SettingStore";
import NativeApi from "@/api/NativeApi";
import Result from "@/global/Result";

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
    result: Array<string>;

}

export default class PicGoImageStrategyImpl implements ImageStrategy {

    async upload(path: string): Promise<string> {
        let imageSetting = useSettingStore().image;
        let response = await NativeApi.http<PicGoResult>({
            url: `http://${imageSetting.picGo.address}:${imageSetting.picGo.port}/upload`,
            method: "POST",
            data: {
                list: [path]
            }
        });
        console.log(response)
        return new Promise<string>(resolve => {
            resolve(response.result[0]);
        });
    }

    parse(url: string): string {
        return url;
    }

}