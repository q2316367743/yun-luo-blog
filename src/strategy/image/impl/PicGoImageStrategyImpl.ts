import ImageStrategy from "@/strategy/image/ImageStrategy";
import NativeApi from "@/api/NativeApi";
import DialogApi from "@/api/DialogApi";
import {ElLoading} from "element-plus";
import {settingService} from "@/global/BeanFactory";

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

    init(): Promise<void> {
        return Promise.resolve();
    }

    async upload(): Promise<string> {
        const selected = await DialogApi.open({
            title: '请选择图片',
            multiple: true,
            filters: [{
                name: 'Image',
                extensions: ['jpg', 'jpeg', 'png', 'webp']
            }, {
                name: '全部',
                extensions: ['*']
            }]
        });
        if (typeof selected === 'object' && selected) {
            const loading = ElLoading.service({
                lock: true,
                text: '上传图片中',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            try {
                let path = (selected as string[])[0];
                let imageSetting = settingService.getImage();
                let response = await NativeApi.http<PicGoResult>({
                    url: `http://${imageSetting.picGo.address}:${imageSetting.picGo.port}/upload`,
                    method: "POST",
                    data: {
                        list: [path]
                    }
                });
                loading.close();
                return new Promise<string>(resolve => {
                    resolve(response.result[0]);
                });
            } catch (e) {
                console.error(e);
                return Promise.reject(e);
            } finally {
                loading.close();
            }
        } else {
            return Promise.reject("");
        }
    }

    parse(url: string): string {
        return url;
    }

}