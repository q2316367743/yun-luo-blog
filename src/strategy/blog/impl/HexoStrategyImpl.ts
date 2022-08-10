import BlogStrategy from "@/strategy/blog/BlogStrategy";
import {useSettingStore} from "@/store/SettingStore";
import {ElLoading, ElMessage, ElMessageBox, ElNotification} from "element-plus";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import Hexo from "@/global/config/Hexo";
import {postService} from "@/global/BeanFactory";
import PostStatusEnum from "@/enumeration/PostStatusEnum";
import FileEntry from "@/api/entities/FileEntry";
import NativeApi from "@/api/NativeApi";
import platformStrategyContext from "@/strategy/platform/PlatformStrategyContext";
import StrUtil from "@/utils/StrUtil";

/**
 * hexo策略
 */
export default class HexoStrategyImpl implements BlogStrategy {

    async isInit(): Promise<boolean> {
        let items = await FileApi.listDir(await Constant.PATH.HEXO());
        return Promise.resolve(items.length > 0);
    }

    async sync(): Promise<void> {
        if (!(await this.isInit())) {
            return Promise.reject("博客未初始化，请初始化后重试")
        }
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
            loading.setText("复制本地图片到目标文件夹");
            // 创建目标文件夹
            let targetDirPath = await FileApi.resolve(await Constant.PATH.HEXO_PUBLIC(), Constant.POST_IMAGES);
            await FileApi.createDir(targetDirPath);
            let postImages = await FileApi.listDir(postImage, true);
            for (let item of postImages) {
                let targetPath = await FileApi.resolve(targetDirPath, item.name!);
                if (item.children) {
                    await FileApi.createDir(targetPath);
                } else {
                    await FileApi.copyFile(item.path, targetPath);
                }
            }
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
        if (!(await this.isInit())) {
            return Promise.reject("博客未初始化，请初始化后重试")
        }
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
        if (!(await this.isInit())) {
            return Promise.reject("博客未初始化，请初始化后重试")
        }
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
            await NativeApi.invokeAsync({
                id: new Date().getTime(),
                command: hexoCommandPath,
                currentDir: hexoPath,
                args: Constant.HEXO.SERVER,
                out: (event, data) => {
                    ElNotification({
                        title: '消息',
                        message: StrUtil.uint8ArrayToString(data),
                        type: 'success',
                    });
                },
                err: (event, data) => {
                    ElNotification({
                        title: '异常',
                        message: StrUtil.uint8ArrayToString(data),
                        type: 'error',
                    });
                },
                exit: (event, data) => {
                    ElNotification({
                        title: '退出',
                        message: StrUtil.uint8ArrayToString(data),
                        type: 'info',
                    });
                }
            });
            return new Promise<void>((resolve) => {
                loading.close();
                ElMessageBox.confirm(
                    '程序运行成功，是否打开网页',
                    '成功', {
                        confirmButtonText: '打开',
                        cancelButtonText: '取消',
                        type: 'success',
                    }
                ).then(() => {
                    NativeApi.openUrl("http://localhost:4000");
                }).catch(() => {
                })
                resolve();
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    async deploy(): Promise<void> {
        if (!(await this.isInit())) {
            return Promise.reject("博客未初始化，请初始化后重试")
        }
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