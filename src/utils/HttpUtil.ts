import {fetch, ResponseType} from '@tauri-apps/api/http';
import Request from "@/global/Request";
import Response from "@/global/Response";


export default {

    async native(request: Request): Promise<Response> {
        console.log('开始请求', request.url, {
            // @ts-ignore
            method: request.method.toUpperCase(),
            timeout: request.timeout ? request.timeout : 3000,
            query: request.params,
            body: request.data,
            responseType: ResponseType.JSON
        });
        let response = await fetch(request.url, {
            // @ts-ignore
            method: request.method.toUpperCase(),
            timeout: request.timeout ? request.timeout : 3000,
            query: request.params,
            body: request.data,
            responseType: ResponseType.JSON
        });
        console.log(response)

        return new Promise<Response>((resolve) => {
            resolve({
                code: response.status,
                data: response.data
            })
        })
    }

}
