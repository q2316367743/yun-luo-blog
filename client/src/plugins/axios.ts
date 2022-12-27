import axios, {AxiosRequestConfig} from 'axios';
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import {ElMessage} from "element-plus";
import Result from "../global/Result";
import Constant from "@/global/Constant";

export default async function http<T>(config: AxiosRequestConfig): Promise<T> {
    // @ts-ignore
    config.baseURL = Constant.baseUrl;
    if (localStorage.getItem('token')) {
        if (config.headers) {
            config.headers['token'] = localStorage.getItem('token')!
        } else {
            config.headers = {
                token: localStorage.getItem('token')!
            }
        }
    }
    let response = await axios.post(config.url!, config.data, config);
    // 处理响应
    if (response.status === 200) {
        let data = response.data as Result<T>;
        if (data.code === 200) {
            return Promise.resolve(data.data as T);
        } else if (data.code === 401) {
            // 路由到登录
            emitter.emit(MessageEventEnum.SYSTEM_LOGIN);
            localStorage.removeItem('token');
            ElMessage({
                showClose: true,
                type: 'error',
                message: '未登录，请登录'
            });
            return Promise.reject("未登录");
        } else if (data.code === 403) {
            // 路由到登录
            emitter.emit(MessageEventEnum.SYSTEM_LOGIN);
            localStorage.removeItem('token');
            ElMessage({
                showClose: true,
                type: 'error',
                message: '认证错误，请重新登陆'
            });
            return Promise.reject("认证错误");
        } else {
            ElMessage({
                showClose: true,
                type: 'error',
                message: data.message
            });
            return Promise.reject(data.message);
        }
    } else if (response.status === 500) {
        ElMessage({
            showClose: true,
            type: 'error',
            message: '服务器异常'
        });
        return Promise.reject("异常");
    } else {
        return Promise.resolve(response.data as T);
    }
};

