import ServerSetting from "@/entities/setting/ServerSetting";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import ObjectUtil from "@/utils/ObjectUtil";
import BasicSetting from "@/entities/setting/BasicSetting";
import ArrayUtil from "@/utils/ArrayUtil";
import ImageSetting from "@/entities/setting/ImageSetting";
import ImageTypeEnum from "@/enumeration/ImageTypeEnum";
import {ElNotification} from "element-plus";
import EnvironmentSetting from "@/entities/setting/EnvironmentSetting";
import SyncRemoteSetting from "@/entities/setting/SyncRemoteSetting";

let basicSetting = {
    blogType: 'hexo',
    font: '微软雅黑',
    path: "",
    language: 'zhCn'
} as BasicSetting;

let serverSetting = {
    port: 8888,
    // 更新是否同步
    updateBySync: true,
    // 同步成功是否通知
    noticeBySyncWithSuccess: false,
    // 同步错误是否通知
    noticeBySyncWithError: true
} as ServerSetting;

let imageSetting = {
    type: 1,
    qiNiu: {
        accessKey: '',
        secretKey: '',
        storageSpace: '',
        accessUrl: '',
        storageArea: '',
        urlSuffix: '',
        storagePath: ''
    },
    picGo: {
        address: '127.0.0.1',
        port: 36677
    }
} as ImageSetting;

let environmentSetting = {
    nodePath: '',
    npmPath: '',
    hexoPath: '',
    gitPath: '',
    npmMirror: 'https://registry.npmmirror.com'
} as EnvironmentSetting;

// 同步设置
let syncRemoteSetting = {
    type: 1,
    sftp: {
        server: '',
        port: 22,
        username: '',
        connectType: 1,
        password: '',
        privateKey: '',
        remoteDir: ''
    }
} as SyncRemoteSetting;

/**
 * 服务器设置服务
 */
export default class SettingService {

    private server: ServerSetting = serverSetting;
    private basic: BasicSetting = basicSetting;
    private image: ImageSetting = imageSetting;
    private environment: EnvironmentSetting = environmentSetting;
    private syncRemote: SyncRemoteSetting = syncRemoteSetting;

    constructor() {
        this.initServer().then(() => {
            console.log('服务器设置初始化成功');
        });
        this.initBasic().then(() => {
            console.log('基础设置初始化成功');
        });
        this.initImage().then(() => {
            console.log('图片设置初始化成功');
        });
        this.initEnvironment().then(() => {
            console.log('环境设置初始化成功');
        });
        this.initSyncRemote().then(() => {
            console.log('同步 - 远程设置初始化成功');
        });
    }

    /**
     * 初始化服务器设置
     */
    async initServer(): Promise<void> {
        let path = await Constant.FILE.SETTING_SERVER();
        // 读取文件
        let source = {}
        if (await FileApi.exist(path)) {
            try {
                let content = await FileApi.readFile(path);
                source = JSON.parse(content);
            } catch (e) {
                console.error(e);
            }
        }
        this.server = ObjectUtil.assignWithTarget(source, serverSetting);
    }

    /**
     * 初始化基础设置
     */
    async initBasic(): Promise<void> {
        let path = await Constant.FILE.SETTING_BASIC();
        // 读取文件
        let source = {}
        if (await FileApi.exist(path)) {
            try {
                let content = await FileApi.readFile(path);
                source = JSON.parse(content);
            } catch (e) {
                console.error(e);
            }
        }
        this.basic = ObjectUtil.assignWithTarget(source, basicSetting);
        if (!ArrayUtil.contains(['LXGWWenKai', '微软雅黑', '宋体'], this.basic.font)) {
            this.basic.font = '微软雅黑';
            this.saveBasic(this.basic).then(() => {
                console.log('字体错误，重置基础设置')
            });
        }
        document.getElementsByTagName('body')[0]!.style.fontFamily = `${this.basic.font}, "Microsoft YaHei", Arial, sans-serif`
    }

    /**
     * 初始化服务器设置
     */
    async initImage(): Promise<void> {
        let path = await Constant.FILE.SETTING_IMAGE();
        // 读取文件
        let source = {}
        if (await FileApi.exist(path)) {
            try {
                let content = await FileApi.readFile(path);
                source = JSON.parse(content);
            } catch (e) {
                console.error(e);
            }
        }
        this.image = ObjectUtil.assignWithTarget(source, imageSetting);
        if (this.image.type === ImageTypeEnum.LOCAL) {
            // 不建议使用本地
            ElNotification({
                title: '建议配置图床',
                message: '检测到未配置图床，建议配置图床使用',
                type: 'warning',
            })
        }
    }

    /**
     * 初始化环境设置
     */
    async initEnvironment(): Promise<void> {
        let path = await Constant.FILE.SETTING_ENVIRONMENT();
        // 读取文件
        let source = {}
        if (await FileApi.exist(path)) {
            try {
                let content = await FileApi.readFile(path);
                source = JSON.parse(content);
            } catch (e) {
                console.error(e);
            }
        }
        this.environment = ObjectUtil.assignWithTarget(source, environmentSetting);
    }

    /**
     * 初始化服务器设置
     */
    async initSyncRemote(): Promise<void> {
        let path = await Constant.FILE.SETTING_SYNC_REMOTE();
        // 读取文件
        let source = {}
        if (await FileApi.exist(path)) {
            try {
                let content = await FileApi.readFile(path);
                source = JSON.parse(content);
            } catch (e) {
                console.error(e);
            }
        }
        this.syncRemote = ObjectUtil.assignWithTarget(source, syncRemoteSetting);
    }

    /**
     * 获取服务器设置
     */
    getServer(): ServerSetting {
        return JSON.parse(JSON.stringify(this.server));
    }

    /**
     * 获取基础设置
     */
    getBasic(): BasicSetting {
        return JSON.parse(JSON.stringify(this.basic));
    }

    /**
     * 获取远程设置
     */
    getSyncRemote(): SyncRemoteSetting {
        return JSON.parse(JSON.stringify(this.syncRemote));
    }

    /**
     * 获取基础设置
     */
    getImage(): ImageSetting {
        return JSON.parse(JSON.stringify(this.image));
    }

    /**
     * 获取环境设置
     */
    getEnvironment(): EnvironmentSetting {
        return JSON.parse(JSON.stringify(this.environment));
    }

    /**
     * 保存服务器设置
     * @param server 服务器设置
     */
    async saveServer(server: ServerSetting): Promise<void> {
        let path = await Constant.FILE.SETTING_SERVER();
        return new Promise<void>(resolve => {
            FileApi.writeFile(path, JSON.stringify(server)).then(() => {
                this.server = server;
                resolve();
            })
        });
    }

    /**
     * 保存基础设置
     * @param basic 基础设置
     */
    async saveBasic(basic: BasicSetting): Promise<void> {
        let path = await Constant.FILE.SETTING_BASIC();
        return new Promise<void>(resolve => {
            FileApi.writeFile(path, JSON.stringify(basic)).then(() => {
                this.basic = basic;
                resolve();
            })
        });
    }

    /**
     * 保存图片设置
     * @param image 图片设置
     */
    async saveImage(image: ImageSetting): Promise<void> {
        let path = await Constant.FILE.SETTING_IMAGE();
        return new Promise<void>(resolve => {
            FileApi.writeFile(path, JSON.stringify(image)).then(() => {
                this.image = image;
                resolve();
            })
        });
    }

    /**
     * 保存环境设置
     * @param environment 环境设置
     */
    async saveEnvironment(environment: EnvironmentSetting): Promise<void> {
        let path = await Constant.FILE.SETTING_ENVIRONMENT();
        return new Promise<void>(resolve => {
            FileApi.writeFile(path, JSON.stringify(environment)).then(() => {
                this.environment = environment;
                resolve();
            })
        });
    }

    /**
     * 保存服务器设置
     * @param syncRemote 同步 - 远程设置
     */
    async saveSyncRemote(syncRemote: SyncRemoteSetting): Promise<void> {
        let path = await Constant.FILE.SETTING_SYNC_REMOTE();
        return new Promise<void>(resolve => {
            FileApi.writeFile(path, JSON.stringify(syncRemote)).then(() => {
                this.syncRemote = syncRemote;
                resolve();
            })
        });
    }

}