import BlogStrategy from "@/strategy/blog/BlogStrategy";
import {useSettingStore} from "@/store/SettingStore";
import {ElLoading, ElMessage} from "element-plus";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import Hexo from "@/global/config/Hexo";
import {postService} from "@/global/BeanFactory";
import PostStatusEnum from "@/enumeration/PostStatusEnum";
import FileEntry from "@/api/entities/FileEntry";
import NativeApi from "@/api/NativeApi";
import platformStrategyContext from "@/strategy/platform/PlatformStrategyContext";

/**
 * hexo策略
 */
export default class HexoStrategyImpl implements BlogStrategy {

    async sync(): Promise<void> {
        // 获取hexo命令目录
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<void>((resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        const loading = ElLoading.service({
            lock: true,
            text: '开始同步',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            loading.setText("将文章复制到目标文件夹");
            // 获取配置
            let hexoPath = await Constant.PATH.HEXO();
            let hexoConfig = await Constant.PATH.HEXO_CONFIG();
            let hexoConfigContent = "";
            try {
                hexoConfigContent = await FileApi.readFile(hexoConfig)
            } catch (e) {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '无法读取配置文件，使用默认'
                });
                console.error(e);
            }
            let hexo = new Hexo(hexoConfigContent);
            let postImage = await Constant.PATH.POST_IMAGES();
            let source_dir = await FileApi.resolve(hexoPath, hexo.source_dir);
            let _posts = await FileApi.resolve(source_dir, "_posts");
            // _posts文件夹可能不存在
            await FileApi.createDir(_posts, true);
            // 复制图片到目标文件夹
            await FileApi.copyDir(_posts, postImage);
            // 复制发布的文章
            let posts = await postService.list({
                status: PostStatusEnum.RELEASE
            });
            await FileApi.copyFileToDir(_posts, false, posts.map(e => {
                return {
                    name: e.fileName,
                    path: e.path
                } as FileEntry
            }));
            loading.setText("执行缓存清理");
            await this.clean();
            loading.setText("执行构建命令");
            await this.deploy();
            loading.setText("迁移文件到dist目录");
            await FileApi.copyDir(await Constant.PATH.DIST(), await Constant.PATH.HEXO_PUBLIC())
            loading.setText("推送到远程");
            await platformStrategyContext.getStrategy().push();
            return new Promise<void>((resolve) => {
                loading.close();
                resolve();
            })
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            loading.close();
        }
    }

    async init(): Promise<void> {
        // 获取hexo命令目录
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<void>((resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        const loading = ElLoading.service({
            lock: true,
            text: '开始初始化',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            // 获取hexo目录
            let hexoPath = await Constant.PATH.HEXO();
            loading.setText("重置目录");
            // 先删除旧的目录
            await FileApi.removeDir(hexoPath);
            // 创建新的目录
            await FileApi.createDir(hexoPath);
            loading.setText("执行初始化命令");
            // 执行初始化命令
            await NativeApi.invokeCmd(hexoCommandPath, hexoPath, Constant.HEXO.INIT);
            return new Promise<void>((resolve) => {
                loading.close();
                resolve();
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            loading.close();
        }
    }

    async clean(): Promise<void> {
        // 获取hexo命令目录
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<void>((resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        const loading = ElLoading.service({
            lock: true,
            text: '开始清理',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            let hexoPath = await Constant.PATH.HEXO();
            await NativeApi.invokeCmd(hexoCommandPath, hexoPath, Constant.HEXO.CLEAN);
            return new Promise<void>((resolve) => {
                loading.close();
                resolve();
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            loading.close();
        }
    }

    async server(): Promise<void> {
        // 获取hexo命令目录
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<void>((resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        const loading = ElLoading.service({
            lock: true,
            text: '开始运行',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            let hexoPath = await Constant.PATH.HEXO();
            await NativeApi.invokeAsync(hexoCommandPath, hexoPath, Constant.HEXO.SERVER);
            return new Promise<void>((resolve) => {
                loading.close();
                NativeApi.openUrl("http://localhost:4000");
                resolve();
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    async deploy(): Promise<void> {
        // 获取hexo命令目录
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<void>((resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        const loading = ElLoading.service({
            lock: true,
            text: '开始打包',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            let hexoPath = await Constant.PATH.HEXO();
            await NativeApi.invokeCmd(hexoCommandPath, hexoPath, Constant.HEXO.DEPLOY);
            return new Promise<void>((resolve) => {
                loading.close();
                resolve();
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            loading.close();
        }
    }

}