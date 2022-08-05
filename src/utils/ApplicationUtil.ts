import Constant from '@/global/Constant';
import FileApi from "@/api/FileApi";
import Hexo from "@/global/config/Hexo";
import {ElLoading, ElMessage} from "element-plus";
import {postService} from "@/global/BeanFactory";
import PostStatusEnum from "@/enumeration/PostStatusEnum";
import HexoUtil from "@/utils/HexoUtil";
import {useSettingStore} from "@/store/SettingStore";
import FileEntry from "@/api/entities/FileEntry";
import BlogTypeEnum from "@/enumeration/BlogTypeEnum";
import strategyContext from "@/strategy/blog/BlogStrategyContext";

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
            // Hexo目录
            Constant.PATH.HEXO().then(path => {
                FileApi.createDir(path).catch(() => {
                });
            });
        })
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

    /**
     * 同步逻辑
     */
    async sync(): Promise<void> {
        let basicSetting = useSettingStore().basic;
        return strategyContext.getStrategy(basicSetting.blogType).sync();
    },

}