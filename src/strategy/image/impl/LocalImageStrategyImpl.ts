import ImageStrategy from "@/strategy/image/ImageStrategy";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";

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

    async upload(path: string): Promise<string> {
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
    }

    parse(url: string): string {
        return this.postImagePath + url.substring(1);
    }

}