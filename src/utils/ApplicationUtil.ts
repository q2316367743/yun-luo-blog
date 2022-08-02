import Constant from '@/global/Constant';
import FileUtil from "@/utils/FileUtil";
import Hexo from "@/global/config/Hexo";
import {ElLoading} from "element-plus";

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
            FileUtil.createDir(path).catch(() => {
            });
        })
        // 创建配置文件夹
        Constant.PATH.CONFIG().then(path => {
            FileUtil.createDir(path).catch(() => {
            });
        })
        // 文章目录
        Constant.PATH.POST().then(path => {
            FileUtil.createDir(path).catch(() => {
            });
        })
        // 图片目录
        Constant.PATH.POST_IMAGES().then(path => {
            FileUtil.createDir(path).catch(() => {
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
     * 执行同步
     */
    async sync(): Promise<void> {
        // TODO: 同步：将文章复制到目标文件夹 -> 执行构建命令 -> 推送到远程
        const loading = ElLoading.service({
            lock: true,
            text: '开始同步',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        loading.setText("将文章复制到目标文件夹");
        // 获取配置
        let hexoPath = await Constant.PATH.HEXO();
        let hexoConfig = await Constant.PATH.HEXO_CONFIG();
        let hexo = new Hexo(await FileUtil.readFile(hexoConfig));
        let post = await Constant.PATH.POST();
        let postImage = await Constant.PATH.POST_IMAGES();
        let _posts = await FileUtil.resolve(hexoPath, hexo.source_dir, "_posts");
        // 复制文章，图片到目标文件夹
        await FileUtil.copyFile(_posts, post, postImage);
        loading.setText("执行构建命令");
        loading.setText("推送到远程");
        return new Promise<void>((resolve) => {
            loading.close();
            resolve();
        })
    }

}