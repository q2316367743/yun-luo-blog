import PostView from '@/views/PostView';
import Constant from '@/global/Constant';
import FileApi from "@/api/FileApi";
import HttpApi from "@/api/HttpApi";
import {useSettingStore} from '@/store/SettingStore'
import Entry from "@/global/Entry";
import jsyaml from "js-yaml";
import ArrayUtil from "@/utils/ArrayUtil";

const knownKey = ['title', 'status', 'date', 'updated', 'comments', 'tags',
    'categories', 'permalink', 'excerpt', 'disableNunjucks', 'lang'];
const excludeKey = ['extra', 'content', 'fileName', 'path'];

/**
 * 解析文章
 * @param path 文章地址
 * @param name 文件名，默认文章名
 * @param renderContent 是否解析渲染内容，默认不解析
 * @return 文章详情
 */
export async function parsePost(path: string, name: string, renderContent: boolean = false): Promise<PostView | void> {
    // 默认当前时间
    let date = new Date();
    // 初始数据
    let post = {
        title: name,
        fileName: name,
        path: path,
        status: 1,
        date: date.getTime(),
        updated: date.getTime(),
        comments: false,
        tags: [],
        categories: [],
        permalink: "",
        excerpt: "",
        disableNunjucks: "",
        lang: "",
        extra: new Array<Entry>()
    } as PostView;
    const contents = await FileApi.readFile(path);
    let lines = contents.split('\n');
    let start = true;
    let lastIndex = 0;
    let frontMatter = "";
    for (let index = 0; index < lines.length; index++) {
        let line = lines[index].trim();
        if (line !== '') {
            // 有值
            if (start) {
                // 第一个
                if (line === '---') {
                    start = false;
                } else {
                    // 第一个不是---，则无法解析内容
                    lastIndex = index;
                    break;
                }
            } else {
                // 开始解析
                try {
                    if (line === '---') {
                        // 结束
                        lastIndex = index + 1;
                        break;
                    } else {
                        // 其他的，加入拓展
                        frontMatter += (line + "\n");
                    }
                } catch (e) {
                    console.error('异常');
                    console.error(e)
                }
            }
        }
    }
    // 默认解析
    let temp = Object.assign({}, jsyaml.load(frontMatter)) as any;
    for (let key of Object.keys(temp)) {
        if (ArrayUtil.contains(excludeKey, key)) {
            // 如果等于拓展，跳过
            continue;
        }
        if (ArrayUtil.contains(knownKey, key)) {
            // 这是个已知的key
            // @ts-ignore
            post[key] = temp[key];
        } else {
            // 这是个未知的key
            post.extra.push({
                id: new Date().getTime(),
                key: key,
                value: temp[key]
            })
        }
    }
    if (renderContent) {
        // 渲染内容
        post.content = '';
        lines.slice(lastIndex).flatMap(line => post.content = post.content + line + "\n");
    }
    // 读取文章内容
    return new Promise<PostView | void>((resolve) => {
        resolve(post);
    });
}

/**
 * 将文章保存
 * @param post 文章内容
 */
export async function savePost(post: PostView): Promise<void> {
    // 内容
    let content = "";
    content += "---\n";
    // 书写Front-matter
    let target = {} as any;
    // 已知的键
    for (let key of knownKey) {
        // 将已知的key赋值
        // @ts-ignore
        target[key] = post[key];
    }
    // 将未知的key赋值
    for (let entry of post.extra) {
        target[entry.key] = entry.value;
    }
    content += jsyaml.dump(target);
    content += "\n---\n"
    content += post.content;
    console.log('处理完成，开始保存')
    return FileApi.writeFile(post.path, content)
}

export async function deleteByPath(path: string): Promise<void> {
    return FileApi.removeFile(path);
}

/**
 * 拷贝本体图片
 *
 * @param imagePath 本地图片地址
 * @returns 新的地址
 */
export async function copyImage(imagePath: string): Promise<string> {
    // 获取类型
    let type = useSettingStore().imageSetting.type;
    // 解析文件名
    let tempPath = imagePath.replaceAll('\\', '/');
    let items = tempPath.split('/');
    let name = items[items.length - 1];
    name = name.replaceAll(' ', '-');
    let newPath = "";
    // 处理
    if (type === 1) {
        let localPath = await localImage(imagePath, name);
        newPath = `/${localPath}`
    } else if (type === 3) {
        // PicGo
        let remotePath = await picGoImage(imagePath);
        if (!remotePath || !remotePath.success) {
            console.log(remotePath)
            return new Promise<string>((resolve, reject) => {
                reject('文件上传错误')
            })
        }
        newPath = remotePath.list[0]
    } else {
        return new Promise<string>((resolve, reject) => {
            reject('图片类型错误');
        });
    }
    return new Promise<string>((resolve) => {
        resolve(newPath);
    })
}

/**
 * 本地图片模式
 *
 * @param path 图片地址
 * @param name 图片名称
 * @returns 新的文件地址
 */
async function localImage(path: string, name: string): Promise<string> {
    let postImage = await Constant.PATH.POST_IMAGES();
    await FileApi.copyFileToDir(postImage, false, [{
        name,
        path
    }]);
    return new Promise<string>((resolve) => {
        resolve(name);
    });
}

/**
 * PicGo响应体
 */
interface PicGoResult {

    /**
     * 是否成功
     */
    success: boolean;

    /**
     * 新的文件地址
     */
    list: Array<string>;

}

/**
 * 使用PicGo上传图片
 *
 * @param imagePath 图片地址
 * @returns 上传后的文件地址
 */
async function picGoImage(imagePath: string): Promise<PicGoResult> {
    let imageSetting = useSettingStore().imageSetting;
    let axiosPromise = await HttpApi.native({
        method: 'POST',
        url: `http://${imageSetting.picGo.address}:${imageSetting.picGo.port}/upload`,
        data: {
            list: [imagePath]
        }
    });
    return axiosPromise.data;
}