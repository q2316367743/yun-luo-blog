import FileApi from "@/api/FileApi";
import Entry from "@/global/Entry";
import jsYaml from "js-yaml";
import ArrayUtil from "@/utils/ArrayUtil";
import Constant from "@/global/Constant";
import PostView from "@/views/PostView";

const knownKey = ['title', 'layout', 'status', 'date', 'updated', 'comments', 'tags',
    'categories', 'permalink', 'excerpt', 'disableNunjucks', 'lang'];

/**
 * 解析文章
 * @param type 文章类型：posts/pages
 * @param name 文件名，默认文章名
 * @param renderContent 是否解析渲染内容，默认不解析
 * @return 文章详情
 */
export async function parsePost(type: string, name: string, renderContent: boolean = true): Promise<PostView | void> {
    // 默认当前时间
    let date = new Date();
    // 初始数据
    let post = {
        title: name,
        fileName: name,
        layout: '',
        status: 1,
        date: date,
        updated: date,
        comments: false,
        permalink: "",
        excerpt: "",
        disableNunjucks: "",
        lang: "",
        type: type,
        extra: new Array<Entry>(),
        expand: ''
    } as PostView;
    const contents = await FileApi.readFile(await FileApi.resolve(await Constant.FOLDER.BASE(), type, name));
    let lines = contents.split('\n');
    let start = true;
    let lastIndex = 0;
    let frontMatterStr = "";
    for (let index = 0; index < lines.length; index++) {
        let line = lines[index];
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
                        frontMatterStr += (line + "\n");
                    }
                } catch (e) {
                    console.error('异常');
                    console.error(e)
                }
            }
        }
    }
    // 默认解析
    let frontMatter = Object.assign({}, jsYaml.load(frontMatterStr)) as any;
    let timestamp = new Date().getTime();
    let index = 0;
    for (let key of Object.keys(frontMatter)) {
        index += 1;
        if (ArrayUtil.contains(knownKey, key)) {
            // 这是个已知的key
            if (frontMatter[key]) {
                // 只有值存在的时候才会替换
                // @ts-ignore
                post[key] = frontMatter[key];
            }
        } else {
            // 这是个未知的key
            if (typeof frontMatter[key] === 'object') {
                // 如果是个对象，咋加入拓展
                post.expand = post.expand + "\n" + JSON.stringify(frontMatter[key], null, 4);
            } else {
                // 普通值，
                post.extra.push({
                    id: timestamp + index,
                    key: key,
                    value: frontMatter[key]
                });
            }
        }
    }
    if (renderContent) {
        // 渲染内容
        post.content = '';
        lines.slice(lastIndex).flatMap(line => post.content = post.content + line + "\n");
    }
    // 读取文章内容
    return Promise.resolve(post);
}

/**
 * 将文章保存
 * @param type 文章类型：posts/pages
 * @param post 文章内容
 */
export async function savePost(type: string, post: PostView): Promise<void> {
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
    content += jsYaml.dump(target);
    if (post.expand && post.expand.trim() !== '') {
        content += '\n';
        // 加入用户拓展属性
        content += post.expand
    }
    content += "\n---\n"
    content += post.content;
    console.log('处理完成，开始保存')
    let path = await FileApi.resolve(await Constant.FOLDER.BASE(), type, post.fileName);
    return FileApi.writeFile(path, content)
}

export async function deleteByPath(type: string, name: string): Promise<void> {
    let path = await FileApi.resolve(await Constant.FOLDER.BASE(), type, name);
    return FileApi.removeFile(path);
}