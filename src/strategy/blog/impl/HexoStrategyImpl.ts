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
import CommandBatchOptions from "@/api/entities/CommandBatchOptions";

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
            return new Promise<void>((_resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        const loading = ElLoading.service({
            lock: true,
            text: '开始同步',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            await this.copyPost(loading);
            await this.clean(loading);
            await this.deploy(loading);
            await this.copyPostImage(loading);
            await this.copyToDist(loading);
            loading.setText("推送到远程");
            await platformStrategyContext.getStrategy().push();
            return Promise.resolve();
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            loading.close();
        }
    }

    async build(callback: () => void): Promise<void> {
        // 基础
        console.log('开始构建', new Date().getTime());
        if (!(await this.isInit())) {
            return Promise.reject("博客未初始化，请初始化后重试")
        }
        // 获取hexo命令目录
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<void>((_resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        let hexoPath = await Constant.PATH.HEXO();
        console.log('拷贝文章', new Date().getTime());
        await this.copyPost();
        let options = {
            batch: [{
                command: hexoCommandPath,
                args: Constant.HEXO.CLEAN,
                dir: hexoPath
            }, {
                command: hexoCommandPath,
                args: Constant.HEXO.DEPLOY,
                dir: hexoPath
            }],
            callback: () => {
                console.log('构建完成', new Date().getTime());
                // 命令执行完，在进行后续复制
                this.copyPostImage().then(() => this.copyToDist().then(callback));
            }
        } as CommandBatchOptions;
        console.log('执行命令', new Date().getTime());
        await NativeApi.invokeCommandBatch(options);
        console.log('命令已执行', new Date().getTime());
        return Promise.resolve();
    }

    private async copyPost(loading?: { setText: (message: string) => void }): Promise<void> {
        if (loading) {
            loading.setText("将文章复制到目标文件夹");
        }
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
        return Promise.resolve();
    }

    private async clean(loading?: { setText: (message: string) => void }): Promise<void> {
        if (loading) {
            loading.setText("执行缓存清理");
        }
        // 清理缓存
        await this.invokeCommand(Constant.HEXO.CLEAN);
        return Promise.resolve();
    }

    private async deploy(loading?: { setText: (message: string) => void }): Promise<void> {
        if (loading) {
            loading.setText("执行构建命令");
        }
        // 执行部署命令
        await this.invokeCommand(Constant.HEXO.DEPLOY);
        return Promise.resolve();
    }

    private async copyPostImage(loading?: { setText: (message: string) => void }): Promise<void> {
        if (loading) {
            loading.setText("复制本地图片到目标文件夹");
        }
        // 将图片资源复制
        let targetDirPath = await FileApi.resolve(await Constant.PATH.HEXO_PUBLIC(), Constant.POST_IMAGES);
        await FileApi.createDir(targetDirPath);
        let postImage = await Constant.PATH.POST_IMAGES();
        let postImages = await FileApi.listDir(postImage, true);
        for (let item of postImages) {
            let targetPath = await FileApi.resolve(targetDirPath, item.name!);
            if (item.children) {
                await FileApi.createDir(targetPath);
            } else {
                await FileApi.copyFile(item.path, targetPath);
            }
        }
        return Promise.resolve();
    }

    private async copyToDist(loading?: { setText: (message: string) => void }): Promise<void> {
        if (loading) {
            loading.setText("迁移文件到dist目录");
        }
        await FileApi.copyDir(await Constant.PATH.DIST(), await Constant.PATH.HEXO_PUBLIC())
    }

    async invokeCommand(command: string): Promise<void> {
        if (!(await this.isInit())) {
            return Promise.reject("博客未初始化，请初始化后重试")
        }
        // 获取hexo命令目录
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<void>((_resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        let hexoPath = await Constant.PATH.HEXO();
        await NativeApi.invokeCmd(hexoCommandPath, hexoPath, command);
        return new Promise<void>((resolve) => {
            resolve();
        });
    }

}