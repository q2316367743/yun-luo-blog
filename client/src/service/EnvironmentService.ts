import Environment from "@/entities/Environment";
import Database from "@/plugins/Database";
import {ElMessage} from "element-plus";
import LocalStorageUtil from "@/utils/LocalStorageUtil";
import Constant from "@/global/Constant";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

export default class EnvironmentService {

    /**
     * 当前环境中的环境ID
     */
    private id: number;
    private readonly environmentDb: Database<Environment>;
    private environment: Environment | undefined;

    constructor(environmentDb: Database<Environment>) {
        this.id = 0;
        this.environmentDb = environmentDb;
    }

    setId(id: number) {
        this.id = id;
        // 设置完成后，获取当前环境
        this.environment = this.environmentDb.one({id: id});
    }

    getId() {
        return this.id;
    }

    /**
     * 获取当前的环境
     */
    getCurrentEnvironment(): Environment {
        if (this.environment) {
            return this.environment;
        } else {
            ElMessage({
                showClose: true,
                type: 'error',
                message: `未${this.environmentDb.count() > 0 ? '选择' : '配置'}环境，请在工具 -> 环境管理中配置`
            })
            throw new Error('未选择环境，请在工具 -> 环境管理中配置');
        }
    }

    /**
     * 全部的环境
     */
    list(): Array<Environment> {
        return this.environmentDb.list();
    }

    /**
     * 切换当前环境
     * @param id 环境ID
     */
    choose(id: number) {
        this.id = id;
        LocalStorageUtil.set(Constant.LOCALSTORAGE.ENVIRONMENT, id);
        this.environment = this.environmentDb.one({id: id});
        emitter.emit(MessageEventEnum.ENVIRONMENT_CHANGE);
    }

    /**
     * 新增一个环境
     * @param environment 环境
     */
    async add(environment: Environment): Promise<void> {
        await this.environmentDb.insert(environment);
        emitter.emit(MessageEventEnum.ENVIRONMENT_CHANGE);
        return Promise.resolve();
    }

    /**
     * 修改一个环境
     * @param environment 环境
     */
    async update(environment: Environment): Promise<void> {
        await this.environmentDb.update(environment);
        emitter.emit(MessageEventEnum.ENVIRONMENT_CHANGE);
        return Promise.resolve();
    }

    /**
     * 删除一个环境
     * @param id 环境ID
     */
    async remove(id: number): Promise<void> {
        await this.environmentDb.delete(id);
        emitter.emit(MessageEventEnum.ENVIRONMENT_CHANGE);
        return Promise.resolve();
    }

}