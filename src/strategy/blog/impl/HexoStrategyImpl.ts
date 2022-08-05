import Strategy from "@/strategy/blog/Strategy";
import {useSettingStore} from "@/store/SettingStore";
import {ElLoading, ElMessage} from "element-plus";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import Hexo from "@/global/config/Hexo";
import {postService} from "@/global/BeanFactory";
import PostStatusEnum from "@/enumeration/PostStatusEnum";
import FileEntry from "@/api/entities/FileEntry";
import HexoUtil from "@/utils/HexoUtil";

/**
 * hexo策略
 */
export default class HexoStrategyImpl implements Strategy {

    async sync(): Promise<void> {
        // 获取hexo命令目录
        let hexoCommandPath = useSettingStore().environment.hexoPath;
        if (!hexoCommandPath || hexoCommandPath === "") {
            return new Promise<void>((resolve, reject) => {
                reject("请配置hexo命令路径");
            })
        }
        // TODO: 同步：将文章复制到目标文件夹 -> 执行构建命令 -> 将构建后的东西复制到指定文件夹 -> 推送到远程
        const loading = ElLoading.service({
            lock: true,
            text: '开始同步',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        loading.setText("将文章复制到目标文件夹");
        // 获取配置
        let hexoPath = await Constant.PATH.HEXO();
        let hexoConfig = await Constant.PATH.HEXO_CONFIG();
        let hexoConfigContent = "";
        try {
            hexoConfigContent=  await FileApi.readFile(hexoConfig)
        }catch (e) {
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
        await HexoUtil.clean();
        loading.setText("执行构建命令");
        await HexoUtil.deploy();
        loading.setText("迁移文件到dist目录");

        loading.setText("推送到远程");
        return new Promise<void>((resolve) => {
            loading.close();
            resolve();
        })
    }

}