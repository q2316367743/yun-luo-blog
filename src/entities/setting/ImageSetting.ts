import ImageQiNiuSetting from "@/entities/setting/ImageQiNiuSetting";
import ImagePicGoSetting from "@/entities/setting/ImagePicGoSetting";

/**
 * 图片设置
 */
export default interface ImageSetting {

    /**
     * 图片类型
     */
    type:number;

    /**
     * 七牛云
     */
    qiNiu: ImageQiNiuSetting;

    /**
     * PicGo
     */
    picGo: ImagePicGoSetting;

}