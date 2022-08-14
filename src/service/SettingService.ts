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
import {useLocalStorage} from "@vueuse/core";

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
let syncSetting = useLocalStorage('syncSetting', {
    platform: "1",
    agreement: 'https://',
    url: '',
    git: {
        name: '',
        branches: '',
        username: '',
        email: '',
        token: '',
        cname: '',
    },
    coding: {
        tokenUsername: '',
    },
    proxy: {
        type: '1',
        path: '',
        port: 0
    },
    netlify: {
        siteId: '',
        accessToken: ''
    }
});

/**
 * 服务器设置服务
 */
export default class SettingService {

    private server: ServerSetting = serverSetting;
    private basic: BasicSetting = basicSetting;
    private image: ImageSetting = imageSetting;
    private environment: EnvironmentSetting = environmentSetting;

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
     * 获取服务器设置
     */
    getServer(): ServerSetting {
        return this.server;
    }

    /**
     * 获取基础设置
     */
    getBasic(): BasicSetting {
        return this.basic;
    }

    /**
     * 获取基础设置
     */
    getImage(): ImageSetting {
        return this.image;
    }

    /**
     * 获取环境设置
     */
    getEnvironment(): EnvironmentSetting {
        return this.environment;
    }

    /**
     * 保存服务器设置
     * @param serverSetting 服务器设置
     */
    async saveServer(serverSetting: ServerSetting): Promise<void> {
        let path = await Constant.FILE.SETTING_SERVER();
        return new Promise<void>(resolve => {
            FileApi.writeFile(path, JSON.stringify(serverSetting)).then(() => {
                this.server = serverSetting;
                resolve();
            })
        });
    }

    /**
     * 保存基础设置
     * @param basicSetting 基础设置
     */
    async saveBasic(basicSetting: BasicSetting): Promise<void> {
        let path = await Constant.FILE.SETTING_BASIC();
        return new Promise<void>(resolve => {
            FileApi.writeFile(path, JSON.stringify(basicSetting)).then(() => {
                this.basic = basicSetting;
                resolve();
            })
        });
    }

    /**
     * 保存图片设置
     * @param imageSetting 图片设置
     */
    async saveImage(imageSetting: ImageSetting): Promise<void> {
        let path = await Constant.FILE.SETTING_IMAGE();
        return new Promise<void>(resolve => {
            FileApi.writeFile(path, JSON.stringify(imageSetting)).then(() => {
                this.image = imageSetting;
                resolve();
            })
        });
    }

    /**
     * 保存环境设置
     * @param environmentSetting 环境设置
     */
    async saveEnvironment(environmentSetting: EnvironmentSetting): Promise<void> {
        let path = await Constant.FILE.SETTING_ENVIRONMENT();
        return new Promise<void>(resolve => {
            FileApi.writeFile(path, JSON.stringify(environmentSetting)).then(() => {
                this.environment = environmentSetting;
                resolve();
            })
        });
    }

}