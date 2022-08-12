import ServerStatusEnum from "@/enumeration/ServerStatusEnum";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import {ElMessageBox, ElNotification} from "element-plus";
import Constant from "@/global/Constant";
import ServerApi from "@/api/ServerApi";
import NativeApi from "@/api/NativeApi";
import blogStrategyContext from "@/strategy/blog/BlogStrategyContext";

/**
 * 服务器 - 服务
 */
export default class ServerService {

    /**
     * 服务器状态
     */
    status: ServerStatusEnum = ServerStatusEnum.STOP;

    /**
     * 是否有待办，
     */
    todo: boolean = false;

    constructor() {
        // 构造函数时注册事件
        emitter.on(MessageEventEnum.POST_ADD, () => {
            this.serverUpdate();
        });
        emitter.on(MessageEventEnum.POST_UPDATE, () => {
            this.serverUpdate();
        });
        emitter.on(MessageEventEnum.POST_DELETE, () => {
            this.serverUpdate();
        });
    }

    /**
     * 服务器资源更新
     */
    private serverUpdate(): void {
        // 只有在运行中才会重新部署
        if (this.status === ServerStatusEnum.RUN) {
            // 服务器状态变为更新中
            this.status = ServerStatusEnum.UPDATE;
            // 发布服务器更新开始事件
            emitter.emit(MessageEventEnum.SERVER_UPDATE_START)
            // 将文件构建到dist目录
            blogStrategyContext.getStrategy().build(() => {
                // 回调成功
                // 部署完成。服务器状态变为运行中
                this.status = ServerStatusEnum.RUN;
                // 发布服务器更新完成事件
                emitter.emit(MessageEventEnum.SERVER_UPDATE_COMPLETE);
                if (this.todo) {
                    // 存在待办，再次部署
                    this.todo = false;
                    this.serverUpdate();
                }
            }).then(() => {
                // 命令发送完成，并不代表构建完成
            }).catch((e) => {
                console.error(e)
                // 部署失败。服务器状态变为运行中
                this.status = ServerStatusEnum.RUN;
                // 发布服务器更新完成事件
                emitter.emit(MessageEventEnum.SERVER_UPDATE_COMPLETE);
                ElNotification({
                    title: '服务器资源更新错误',
                    message: '' + e,
                    type: 'error',
                });
            });
        } else if (this.status === ServerStatusEnum.UPDATE) {
            // 更新中无法直接更新，，增加一个待办
            this.todo = true;
        }
    }

    async start(): Promise<void> {
        let dist = await Constant.PATH.DIST();
        await ServerApi.start(dist, 8888);
        // 状态变为运行中
        this.status = ServerStatusEnum.RUN;
        // 发布服务器启动事件
        emitter.emit(MessageEventEnum.SERVER_START);
        ElMessageBox.confirm('服务器成功运行，是否打开浏览器？', '信息', {
            confirmButtonText: "打开",
            cancelButtonText: "取消"
        }).then(() => {
            NativeApi.openUrl("http://localhost:8888");
        }).catch(() => {
            // 取消打开浏览器
        });
        return Promise.resolve();
    }

    async stop(): Promise<void> {
        await ServerApi.stop((e) => {
            if (e) {
                console.log(e)
                ElNotification({
                    type: 'error',
                    message: "" + e
                });
            }
        })
        this.status = ServerStatusEnum.STOP;
        // 发布服务器停止事件
        emitter.emit(MessageEventEnum.SERVER_STOP);
        return Promise.resolve();
    }


}