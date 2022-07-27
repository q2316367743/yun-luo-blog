import Constant from '@/global/Constant';
import FileUtil from "@/utils/FileUtil";

/**
 * 启动应用
 *
 */
export function launch() {
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
}