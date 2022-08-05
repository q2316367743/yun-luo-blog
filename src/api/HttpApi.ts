import Request from "@/global/Request";
import Response from "@/global/Response";


export default {

    async native<T>(request: Request): Promise<Response<T>> {
        return new Promise<Response<T>>((resolve, reject) => {
            reject('HTTP请求失败')
        })
    }

}
