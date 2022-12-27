export default interface Response<T> {

    /**
     * 响应码
     */
    code: number;

    /**
     * 数据
     */
    data: T;

}