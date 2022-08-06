import ImageStrategy from "@/strategy/image/ImageStrategy";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import DialogApi from "@/api/DialogApi";

export default class LocalImageStrategyImpl implements ImageStrategy {

    private postImagePath: string = "";


    constructor() {
        // 创建时赋值
        this.getPostImagePath().then(path => {
            this.postImagePath = path;
        })
    }

    private async getPostImagePath(): Promise<string> {
        let postImages = await Constant.PATH.POST_IMAGES();
        let target = await FileApi.resolve(postImages, "");
        return new Promise<string>(resolve => {
            resolve(`file:///${target}`);
        })
    }

    async upload(): Promise<string> {
        const selected = await DialogApi.open({
            title: '请选择图片',
            multiple: true,
            filters: [{
                name: 'Image',
                extensions: ['jpg', 'jpeg', 'png', 'webp']
            }, {
                name: '全部',
                extensions: ['*']
            }]
        });
        if (typeof selected === 'object' && selected) {
            let path = (selected as string[])[0];
            path = path.replaceAll('\\', '/');
            let items = path.split('/');
            let name = items[items.length - 1];
            // 将空格替换
            name = name.replaceAll(' ', '-');
            let postImage = await Constant.PATH.POST_IMAGES();
            await FileApi.copyFileToDir(postImage, false, [{
                name,
                path
            }]);
            return new Promise<string>((resolve) => {
                resolve(`/${name}`);
            });
        }else {
            return Promise.reject("");
        }
    }

    parse(url: string): string {
        return this.postImagePath + url.substring(1);
    }

}