import FileApi from "@/api/FileApi";
import Entry from "@/global/Entry";
import jsYaml from "js-yaml";
import Constant from "@/global/Constant";
import PostView from "@/views/PostView";
import ArrayUtil from "@/utils/ArrayUtil";

const knownKey = ['title', 'layout', 'status', 'date', 'updated', 'comments', 'tags',
    'categories', 'permalink', 'excerpt', 'disableNunjucks', 'lang'];

/**
 * 解析文章
 * @param type 文章类型：posts/pages
 * @param fileName 文件名，默认文章名
 * @param renderContent 是否解析渲染内容，默认不解析
 * @return 文章详情
 */
export async function parsePost(type: string, fileName: string, renderContent: boolean = true): Promise<PostView | void> {
    // 默认当前时间
    let date = new Date();
    // 初始数据
    let post = {
        title: fileName,
        fileName: fileName,
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
    const contents = await FileApi.readFile(await FileApi.resolve(await Constant.FOLDER.BASE(), type, fileName));
    let lines = contents.split('\n');
    // 模式。0：开始，1：front-matter、2：extra、3：expand
    let mode = 0;
    let lastIndex = 0;
    let frontMatterArr = new Array<string>();
    let extraArr = new Array<string>();
    for (let index = 0; index < lines.length; index++) {
        let line = lines[index];
        line = line.trim();
        if (line !== '') {
            // 有值
            try {
                if (line === Constant.FRONT_MATTER.SEPARATE) {
                    if (mode === 0) {
                        mode = 1;
                    }else {
                        // 结束
                        lastIndex = index + 1;
                        break;
                    }
                }else if (line.startsWith(Constant.FRONT_MATTER.EXTRA)) {
                    mode = 2;
                }else if (line.startsWith(Constant.FRONT_MATTER.EXPAND)) {
                    mode = 3;
                } else {
                    if (mode === 1) {
                        frontMatterArr.push(line);
                    }else if (mode === 2) {
                        extraArr.push(line);
                    }else if (mode === 3) {
                        post.expand = post.expand + line + "\n";
                    }else {
                        console.error('未知模式')
                    }
                }
            } catch (e) {
                console.error('异常');
                console.error(e);
            }
        }
    }
    try {
        let index = 0
        // 处理Front-Matter
        let frontMatter = jsYaml.load(frontMatterArr.join("\n")) as any;
        for (let key of Object.keys(frontMatter)) {
            if (ArrayUtil.contains(knownKey, key)) {
                if (frontMatter[key]) {
                    // @ts-ignore
                    post[key] = frontMatter[key];
                }
            }else {
                if (typeof frontMatter[key] === 'object') {
                    post.expand = post.expand + jsYaml.dump(frontMatter[key]) + "\n";
                }else {
                    index += 1;
                    post.extra.push({
                        id: index,
                        key: key,
                        value: frontMatter[key]
                    });
                }
            }
        }
        if (extraArr.length > 0) {
            // 处理额外的
            let extra = jsYaml.load(extraArr.join("\n")) as any;
            for (let key of Object.keys(extra)) {
                index += 1;
                post.extra.push({
                    id: index,
                    key: key,
                    value: extra[key]
                })
            }
        }
    }catch (e) {
        console.error('异常');
        console.error(e);
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
    // 开始 front-matter
    content += Constant.FRONT_MATTER.SEPARATE;
    content += "\n";
    // 基本内容
    let target = {} as any;
    for (let key of knownKey) {
        // 将已知的key赋值
        // @ts-ignore
        target[key] = post[key];
    }
    content = content+  jsYaml.dump(target) + "\n";
    // 额外属性
    content += Constant.FRONT_MATTER.EXTRA;
    content += "\n"
    for (let entry of post.extra) {
        content += `${entry.key}: ${entry.value}`;
        content += "\n"
    }
    // 拓展属性
    content += Constant.FRONT_MATTER.EXPAND;
    content += "\n"
    if (post.expand && post.expand !== '') {
        content += post.expand
        content += "\n"
    }
    // 完成 front-matter
    content += Constant.FRONT_MATTER.SEPARATE
    content += "\n"
    content += post.content;
    console.log('处理完成，开始保存')
    let path = await FileApi.resolve(await Constant.FOLDER.BASE(), type, post.fileName);
    return FileApi.writeFile(path, content)
}

export async function deleteByPath(type: string, name: string): Promise<void> {
    let path = await FileApi.resolve(await Constant.FOLDER.BASE(), type, name);
    return FileApi.removeFile(path);
}

export async function resolvePath(post: PostView): Promise<string> {
    return Promise.resolve(FileApi.resolve(await Constant.FOLDER.BASE(), post.type, post.fileName));
}