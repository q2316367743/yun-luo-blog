/**
 * 服务器设置服务
 */
import ServerSetting from "@/entities/setting/ServerSetting";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import ObjectUtil from "@/utils/ObjectUtil";

export default class SettingService {

    /**
     * 服务器设置
     */
    server: ServerSetting = {
        port: 8888,
        // 更新是否同步
        updateBySync: true,
        // 同步成功是否通知
        noticeBySyncWithSuccess: false,
        // 同步错误是否通知
        noticeBySyncWithError: true
    };

    constructor() {
        this.initServer().then(() => {
            console.log('服务器配置初始化成功');
        });
    }

    /**
     * 初始化服务器设置
     */
    async initServer(): Promise<void> {
        let path = await Constant.FILE.CONFIG_SERVER();
        // 读取文件
        let content = '{}';
        if (await FileApi.exist(path)) {
            try {
                content = await FileApi.readFile(path);
            }catch (e) {
                console.error(e);
            }
        }
        this.server = ObjectUtil.assignWithTarget(JSON.parse(content), {
            port: 8888,
            // 更新是否同步
            updateBySync: true,
            // 同步成功是否通知
            noticeBySyncWithSuccess: false,
            // 同步错误是否通知
            noticeBySyncWithError: true
        });

    }

    /**
     * 查询服务器设置
     */
    getServer(): ServerSetting {
        return this.server;
    }

    /**
     * 保存服务器设置
     * @param serverSetting 服务器设置
     */
    async saveServer(serverSetting: ServerSetting): Promise<void> {
        let path = await Constant.FILE.CONFIG_SERVER();
        return FileApi.writeFile(path, JSON.stringify(serverSetting));
    }

}