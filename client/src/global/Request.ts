type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';


export default interface Request {

    /**
     * 请求方法
     */
    method: Method | String;

    /**
     * 地址
     */
    url: string;

    /**
     * 请求体内容
     */
    data?: any;

    /**
     * 请求参数
     */
    params?: any;

    /**
     * 超时时间，默认3秒
     */
    timeout?: number

}