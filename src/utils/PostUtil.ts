import PostView from '@/views/PostView';
import FileApi from "@/api/FileApi";
import Entry from "@/global/Entry";
import jsYaml from "js-yaml";
import ArrayUtil from "@/utils/ArrayUtil";

const knownKey = ['title', 'layout', 'status', 'date', 'updated', 'comments', 'tags',
    'categories', 'permalink', 'excerpt', 'disableNunjucks', 'lang'];
const excludeKey = ['extra', 'content', 'fileName', 'path'];

/**
 * 解析文章
 * @param basePath 基础文件所在目录
 * @param name 文件名，默认文章名
 * @param renderContent 是否解析渲染内容，默认不解析
 * @return 文章详情
 */
export async function parsePost(basePath: string, name: string, renderContent: boolean = false): Promise<PostView | void> {
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
        tags: [],
        categories: [],
        permalink: "",
        excerpt: "",
        disableNunjucks: "",
        lang: "",
        extra: new Array<Entry>()
    } as PostView;
    const contents = await FileApi.readFile(await FileApi.resolve(basePath, name));
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
    let temp = Object.assign({}, jsYaml.load(frontMatter)) as any;
    for (let key of Object.keys(temp)) {
        if (ArrayUtil.contains(excludeKey, key)) {
            // 如果等于拓展，跳过
            continue;
        }
        if (ArrayUtil.contains(knownKey, key)) {
            // 这是个已知的key
            if (temp[key]) {
                // 只有值存在的时候才会替换
                // @ts-ignore
                post[key] = temp[key];
            }
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
 * @param basePath 基础目录
 * @param post 文章内容
 */
export async function savePost(basePath: string, post: PostView): Promise<void> {
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
    content += "\n---\n"
    content += post.content;
    console.log('处理完成，开始保存')
    return FileApi.writeFile(await FileApi.resolve(basePath, post.fileName), content)
}

export async function deleteByPath(basePath: string, name: string): Promise<void> {
    let path = await FileApi.resolve(basePath, name);
    return FileApi.removeFile(path);
}