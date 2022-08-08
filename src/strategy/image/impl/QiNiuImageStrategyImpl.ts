import ImageStrategy from "@/strategy/image/ImageStrategy";
import {useSettingStore} from "@/store/SettingStore";
import {ElLoading} from "element-plus";
import NativeApi from "@/api/NativeApi";
import ArrayUtil from "@/utils/ArrayUtil";

export default class QiNiuImageStrategyImpl implements ImageStrategy {

    /**
     * 上传策略
     * 参考文档：<a href="https://developer.qiniu.com/kodo/manual/put-policy">上传策略</a>
     */
    private policyFields: Array<string> = [
        "callbackUrl",
        "callbackBody",
        "callbackHost",
        "callbackBodyType",
        "callbackFetchKey",

        "returnUrl",
        "returnBody",

        "endUser",
        "saveKey",
        "insertOnly",
        "isPrefixalScope",

        "detectMime",
        "mimeLimit",
        "fsizeLimit",
        "fsizeMin",

        "persistentOps",
        "persistentNotifyUrl",
        "persistentPipeline",

        "deleteAfterDays",
        "fileType"
    ];
    /**
     * 启用的字段
     */
    private deprecatedPolicyFields: Array<string> = ["asyncOps"];

    upload(): Promise<string> {
        return Promise.reject("暂不支持")
        // 获取七牛云配置信息
        let image = useSettingStore().image;
        let storageArea = image.qiNiu.storageArea;
        if (!storageArea || storageArea === "") {
            return Promise.reject("存储空间未设置");
        }
        // 打开图片选择框
        let upload = document.createElement("input");
        upload.type = "file"
        upload.style.display = "none";
        const loading = ElLoading.service({
            lock: true,
            text: '上传图片中',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            document.getElementById("app")!.append(upload);
            upload.click();
            return new Promise<string>(resolve => {
                upload.addEventListener('change', ev => {
                    let element = ev.target as HTMLInputElement
                    let file = element.files!.item(0)!;
                    // 获取Key
                    NativeApi.http<any>({
                        url: ""
                    })
                    loading.close();
                })
            })
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            loading.close();
        }
    }

    parse(url: string): string {
        return url;
    }

    private uploadTokenWithDeadline(bucket: string, key: string, deadline: number, policy: Map<string, string>, strict: boolean): string {
        // TODO   UpHosts Global
        let scope = bucket;
        if (key != null) {
            scope = bucket + ":" + key;
        }
        let x = new Map<string, string>();
        this.copyPolicy(x, policy, strict);
        x.set("scope", scope);
        x.set("deadline", deadline + "");

        let s = JSON.stringify(x);
        return this.signWithData(s);
    }

    private copyPolicy(policy: Map<string, string>, originPolicy: Map<string, string>, strict: boolean): void {
        if (originPolicy == null) {
            return;
        }
        originPolicy.forEach((key: string, value: string) => {
            if (ArrayUtil.contains(this.deprecatedPolicyFields, key)) {
                throw new Error(key + " is deprecated!");
            }
            if (!strict || ArrayUtil.contains(this.policyFields, key)) {
                policy.set(key, value);
            }
        });
    }

    private signWithData(data: string): string {
        let s = Buffer.from(data).toString('base64');
        s = s.replaceAll("+", "-").replaceAll("/", "_");
        return this.sign(s) + ":" + s;
    }

    private utf8Bytes(str: string): number[] {
        return [];
    }

    private sign(str: string): string {
        return "";
    }


}