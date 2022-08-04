import Request from "@/global/Request";
import Response from "@/global/Response";


export default {

    async native(request: Request): Promise<Response> {
        return new Promise<Response>((resolve) => {
            resolve({
                code: 200,
                data: ''
            })
        })
    }

}
