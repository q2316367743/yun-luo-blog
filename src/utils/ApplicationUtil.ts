import Constant from '@/global/Constant';
import FileApi from "@/api/FileApi";
import {useSettingStore} from "@/store/SettingStore";
import ImageTypeEnum from "@/enumeration/ImageTypeEnum";
import {ElNotification} from "element-plus";

/**
 * 启动应用
 *
 */
export default {

    /**
     * 启动时操作
     */
    launch() {
        // 获取文档目录
        // 创建基础文件夹
        Constant.PATH.BASE().then(path => {
            FileApi.createDir(path).catch(() => {
            });
            // 创建配置文件夹
            Constant.PATH.CONFIG().then(path => {
                FileApi.createDir(path).catch(() => {
                });
            })
            // 文章目录
            Constant.PATH.POST().then(path => {
                FileApi.createDir(path).catch(() => {
                });
            })
            // 图片目录
            Constant.PATH.POST_IMAGES().then(path => {
                FileApi.createDir(path).catch(() => {
                });
            })
            // 部署目录
            Constant.PATH.DIST().then(path => {
                FileApi.createDir(path).catch(() => {
                });
            });
            // Hexo目录
            Constant.PATH.HEXO().then(path => {
                FileApi.createDir(path).catch(() => {
                });
            });
        });
        // 设置字体
        window.onload = function () {
            document.getElementsByTagName('body')[0]!.style.fontFamily = `${useSettingStore().basic.font}, "Microsoft YaHei", Arial, sans-serif`
        }
        // 建议提示
        // 图片未选择图床
        if (useSettingStore().image.type === ImageTypeEnum.LOCAL) {
            // 不建议使用本地
            ElNotification({
                title: '建议配置图床',
                message: '检测到未配置图床，建议配置图床使用',
                type: 'warning',
            })
        }
    },

    /**
     * 判断是否初始化指定目录
     *
     * @param path 指定目录
     */
    isInit(path: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            resolve(true);
        })
    },

}