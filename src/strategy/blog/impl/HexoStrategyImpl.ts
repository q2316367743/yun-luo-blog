import BlogStrategy from "@/strategy/blog/BlogStrategy";
import {ElLoading, ElMessage} from "element-plus";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import Hexo from "@/global/config/Hexo";
import {pageService, postService, settingService} from "@/global/BeanFactory";
import PostStatusEnum from "@/enumeration/PostStatusEnum";
import FileEntry from "@/api/entities/FileEntry";
import NativeApi from "@/api/NativeApi";
import syncRemoteStrategyContext from "@/strategy/syncRemote/SyncRemoteStrategyContext";

/**
 * hexo策略
 */
export default class HexoStrategyImpl implements BlogStrategy {

    async isInit(): Promise<boolean> {
        let items = await FileApi.listDir(await Constant.FOLDER.HEXO.BASE());
        return Promise.resolve(items.length > 0);
    }

    async sync(): Promise<void> {
        if (!(await this.isInit())) {
            return Promise.reject("博客未初始化，请初始化后重试")
        }
        // 获取hexo命令目录
        let hexoCommandPath = settingService.getEnvironment().hexoPath;
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
            await this.copyPage(loading);
            await this.copyPost(loading);
            await this.clean(loading);
            await this.deploy(loading);
            await this.copyPostImage(loading);
            await this.copyToDist(loading);
            loading.setText("推送到远程");
            await syncRemoteStrategyContext.getStrategy().push();
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
        console.log('拷贝页面', new Date().getTime());
        await this.copyPage();
        console.log('拷贝文章', new Date().getTime());
        await this.copyPost();
        console.log('执行命令', new Date().getTime());
        await this.invokeAsync(() => {
            // 执行后置命令
            console.log('执行后置命令', new Date().getTime());
            this.copyPostImage().then(() => this.copyToDist().then(callback))
                .catch(e => {
                    console.error(e);
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '拷贝图片错误，' + e
                    });
                });
        }, () => {
            // 报错了也要回调
            callback();
        });
        console.log('命令已执行', new Date().getTime());
        return Promise.resolve();
    }

    private async getSourcePath(): Promise<string> {
        let hexoPath = await Constant.FOLDER.HEXO.BASE();
        let hexoConfig = await Constant.FILE.HEXO_CONFIG_BASE();
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
        return await FileApi.resolve(hexoPath, hexo.source_dir)
    }

    private async  copyPost(loading?: { setText: (message: string) => void }): Promise<void> {
        if (loading) {
            loading.setText("将文章复制到目标文件夹");
        }
        // 获取配置
        let sourceDir = await this.getSourcePath();
        let _posts = await FileApi.resolve(sourceDir, "_posts");
        let _drafts = await FileApi.resolve(sourceDir, "_drafts");
        if (await FileApi.exist(_posts)) {
            // 删除旧的文件夹
            await FileApi.removeDir(_posts, true);
        }
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
        if (await FileApi.exist(_drafts)) {
            // 删除旧的文件夹
            await FileApi.removeDir(_drafts, true);
        }
        // _posts文件夹可能不存在
        await FileApi.createDir(_drafts, true);
        // 复制草稿的文章
        let drafts = await postService.list({
            status: PostStatusEnum.DRAFT
        });
        await FileApi.copyFileToDir(_drafts, false, drafts.map(e => {
            return {
                name: e.fileName,
                path: e.path
            } as FileEntry
        }));
        return Promise.resolve();
    }

    private async  copyPage(loading?: { setText: (message: string) => void }): Promise<void> {
        if (loading) {
            loading.setText("将页面复制到目标文件夹");
        }
        // 获取配置
        let sourceDir = await this.getSourcePath();
        // 删除旧的资源文件夹
        await FileApi.removeDir(sourceDir, true);
        // 创建新的的资源文件夹
        await FileApi.createDir(sourceDir, true);
        // 获取上架的页面
        let pages = await pageService.list({
            status: PostStatusEnum.RELEASE
        });
        let timestamp = new Date().getTime();
        for (let page of pages) {
            timestamp += 1;
            let pageInfoPath = await FileApi.resolve(sourceDir, timestamp + "");
            await FileApi.createDir(pageInfoPath);
            let path = await FileApi.resolve(pageInfoPath, 'index.md');
            await FileApi.copyFile(page.path, path);
        }
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
        let targetDirPath = await FileApi.resolve(await Constant.FOLDER.HEXO.PUBLIC(), Constant.NAME.POST_IMAGES);
        await FileApi.createDir(targetDirPath);
        let postImage = await Constant.FOLDER.POST_IMAGES();
        let postImages = await FileApi.listDir(postImage);
        for (let item of postImages) {
            let targetPath = await FileApi.resolve(targetDirPath, item.name!);
            if (!item.isDirectory) {
                // 只会处理在文件内的文件
                await FileApi.copyFile(item.path, targetPath);
            }
        }
        return Promise.resolve();
    }

    private async copyToDist(loading?: { setText: (message: string) => void }): Promise<void> {
        if (loading) {
            loading.setText("迁移文件到dist目录");
        }
        await FileApi.copyDir(await Constant.FOLDER.DIST(), await Constant.FOLDER.HEXO.PUBLIC())
    }

    async invokeCommand(command: string): Promise<void> {
        let hexoCommandPath = await this.getHexoCommandPath();
        let hexoPath = await Constant.FOLDER.HEXO.BASE();
        await NativeApi.invokeSync(hexoCommandPath, hexoPath, command);
        return new Promise<void>((resolve) => {
            resolve();
        });
    }

    async invokeAsync(callback: () => void, error: () => void) {
        let hexoCommandPath = await this.getHexoCommandPath();
        let hexoPath = await Constant.FOLDER.HEXO.BASE();
        await NativeApi.invokeAsync({
            command: hexoCommandPath,
            args: Constant.HEXO.CLEAN,
            currentDir: hexoPath,
            success: () => {
                console.log('clean执行完成，开始执行deploy');
                NativeApi.invokeAsync({
                    command: hexoCommandPath,
                    args: Constant.HEXO.DEPLOY,
                    currentDir: hexoPath,
                    success: callback,
                    warning: message => {
                        console.error(message);
                        ElMessage({
                            showClose: true,
                            type: 'warning',
                            message: message
                        });
                        error();
                    },
                    error: e => {
                        console.error(e);
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '' + e
                        });
                        error();
                    }
                })
            },
            warning: message => {
                console.error(message);
                ElMessage({
                    showClose: true,
                    type: 'warning',
                    message: message
                });
                error();
            },
            error: e => {
                console.error(e);
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '' + e
                });
                error();
            }
        })
    }

    async getHexoCommandPath(): Promise<string> {
        if (!(await this.isInit())) {
            return Promise.reject("博客未初始化，请初始化后重试")
        }
        // 获取hexo命令目录
        let hexoCommandPath = settingService.getEnvironment().hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return Promise.reject("请配置hexo命令路径");
        }
        return Promise.resolve(hexoCommandPath);
    }

}