import Constant from '@/global/Constant';
import FileUtil from "@/utils/FileUtil";

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
        FileUtil.createDir(Constant.BASE).catch(() => {
        });
        // 创建配置文件夹
        FileUtil.createDir(Constant.PATH.CONFIG).catch(() => {
        });
        // 文章目录
        FileUtil.createDir(Constant.PATH.POST).catch(() => {
        });
        // 图片目录
        FileUtil.createDir(Constant.PATH.POST_IMAGES).catch(() => {
        });
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
    }
}