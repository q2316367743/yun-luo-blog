import Constant from '@/global/Constant';
import FileApi from "@/api/FileApi";
import ImageTypeEnum from "@/enumeration/ImageTypeEnum";
import {ElNotification} from "element-plus";
import {settingService} from "@/global/BeanFactory";

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
        Constant.FOLDER.BASE().then(path => {
            FileApi.createDir(path).catch(() => {
            });
            // 创建配置文件夹
            Constant.FOLDER.CONFIG().then(path => {
                FileApi.createDir(path).catch(() => {
                });
            })
            // 文章目录
            Constant.FOLDER.POST().then(path => {
                FileApi.createDir(path).catch(() => {
                });
            })
            // 图片目录
            Constant.FOLDER.POST_IMAGES().then(path => {
                FileApi.createDir(path).catch(() => {
                });
            })
            // 部署目录
            Constant.FOLDER.DIST().then(path => {
                FileApi.createDir(path).catch(() => {
                });
            });
            // git忽略文件
            Constant.FILE.GITIGNORE().then(path => {
                FileApi.exist(path).then(exists => {
                    if (!exists) {
                        // 不存在则创建
                        FileApi.writeFile(path, Constant.CONTENT.GITIGNORE).catch(() => {
                        })
                    }
                })
            })
            Constant.FOLDER.DIST().then(path => {
                FileApi.createDir(path).catch(() => {
                });
            });
            // Hexo目录
            Constant.FOLDER.HEXO().then(path => {
                FileApi.createDir(path).catch(() => {
                });
            });
        });
    },

}