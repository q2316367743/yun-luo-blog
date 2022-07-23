import {
    readTextFile, writeTextFile,
    readBinaryFile, writeBinaryFile,
    removeFile,
    BaseDirectory
}
    from '@tauri-apps/api/fs';
import { documentDir, resolve } from '@tauri-apps/api/path';

import PostView from '@/views/PostView';
import constant from '@/global/constant';
import { useSettingStore } from '@/store/SettingStore'

/**
 * 渲染文章
 * @param path 文章路径
 * @return 文章对象
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
        lang: ""
    } as PostView;
    const contents = await readTextFile(path, { dir: BaseDirectory.Document });
    let lines = contents.split('\n');
    let start = true;
    let lastIndex = 0;
    for (let index = 0; index < lines.length; index++) {
        let line = lines[index].trim();
        if (line === '') {
            lastIndex = index;
            continue;
        } else {
            // 有值
            if (start) {
                // 第一个
                if (line === '---') {
                    start = false;
                } else {
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
                    } else if (line.startsWith('title')) {
                        post.title = line.split(':')[1].trim();
                    } else if (line.startsWith('status')) {
                        post.status = parseInt(line.split(':')[1].trim());
                    } else if (line.startsWith('date')) {
                        post.date = parseInt(line.split(':')[1].trim());
                    } else if (line.startsWith('updated')) {
                        post.updated = parseInt(line.split(':')[1].trim());
                    } else if (line.startsWith('comments')) {
                    } else if (line.startsWith('tags')) {
                        post.tags = [];
                        line.split(':')[1].trim().split(',').forEach(e => {
                            post.tags.push(e.trim())
                        })
                    } else if (line.startsWith('categories')) {
                        post.categories = line.split(':')[1].trim().split(',');
                    } else if (line.startsWith('permalink')) {
                        post.permalink = line.split(':')[1].trim();
                    } else if (line.startsWith('excerpt')) {
                        post.excerpt = line.split(':')[1].trim();
                    } else if (line.startsWith('disableNunjucks')) {
                        post.disableNunjucks = line.split(':')[1].trim();
                    } else if (line.startsWith('lang')) {
                        post.lang = line.split(':')[1].trim();
                    }
                } catch (e) {
                    console.error('异常');
                    console.error(e)
                }
                if (index === 15) {
                    // 最多解析15行
                    lastIndex = index;
                    break;
                }
            }
        }
    }
    if (renderContent) {
        // 渲染内容
        post.content = '';
        lines.slice(lastIndex).flatMap(line => post.content = post.content + line + "\n");
    }
    // 读取文章内容
    return new Promise<PostView | void>((resolve, reject) => {
        resolve(post);
    });
}

export async function savePost(post: PostView): Promise<void> {
    // 内容
    let content = "";
    content += "---\n";
    content += `title: ${post.title}\n`;
    content += `status: ${post.status}\n`;
    content += `date: ${post.date}\n`;
    content += `updated: ${new Date().getTime()}\n`;
    content += `comments: ${post.comments}\n`;
    if (post.tags && post.tags.length > 0) {
        content += `tags: `;
        for (let tag of post.tags) {
            content += tag;
        }
        content += `\n`;
    }
    if (post.categories && post.categories.length > 0) {
        content += `categories: `;
        for (let category of post.categories) {
            content += category;
        }
        content += `\n`;
    }
    content += `permalink: ${post.permalink}\n`;
    content += `excerpt: ${post.excerpt}\n`;
    content += `disableNunjucks: ${post.disableNunjucks}\n`;
    content += `lang: ${post.lang}\n`;
    content += "---\n"
    content += post.content;
    return writeTextFile(post.path, content, {
        dir: BaseDirectory.Document
    })
}

export async function deleteByPath(path: string): Promise<void> {
    return removeFile(path, {
        dir: BaseDirectory.Document
    })
}

/**
 * 拷贝本体图片
 * 
 * @param imagePath 本地图片地址
 * @returns 图片名称
 */
export async function copyImage(imagePath: string): Promise<string> {
    if (useSettingStore().imageSetting.type === 1) {
        return localImage(imagePath);
    } else {
        return new Promise<string>((resolve, reject) => {
            reject('图片类型错误');
        });
    }
}

/**
 * 本地图片模式
 * 
 * @param imagePath 图片地址
 * @returns 图片名称
 */
export async function localImage(imagePath: string): Promise<string> {
    let byte = await readBinaryFile(imagePath, {
        dir: BaseDirectory.Document
    });
    let tempPath = imagePath.replaceAll('\\', '/');
    let items = tempPath.split('/');
    let name = items[items.length - 1];
    let newPath = await resolve(await documentDir(), constant.BASE, constant.POST_IMAGES, name);
    writeBinaryFile(newPath, byte, {
        dir: BaseDirectory.Document
    })
    return new Promise<string>((resolve) => {
        resolve(name);
    })
}