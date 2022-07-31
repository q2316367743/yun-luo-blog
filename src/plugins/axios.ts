import axios from 'axios';

// 创建实例
let instance = axios.create({
    timeout: 6000
});

// 请求拦截器
instance.interceptors.request.use((config) => {
    return config
}, (error) => {
    return error
});

// 响应拦截器
instance.interceptors.response.use(response => {
    return response;
}, error => {
    return error;
})

export default instance;