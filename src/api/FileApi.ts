import FileEntry from "@/api/entities/FileEntry";
import Result from "@/global/Result";


const {ipcRenderer} = window.require('electron');

/**
 * 解析目录
 *
 * @param paths 目录
 */
async function resolve(...paths: string[]): Promise<string> {
    let result = (await ipcRenderer.invoke('file:resolve', {
        paths: paths
    })) as Result;
    if (result.code) {
        return new Promise<string>(resolve => {
            resolve(result.data);
        });
    } else {
        return new Promise<string>((resolve1, reject) => {
            reject(result.message)
        })
    }
}

/**
 * 读取文件夹下全部文件
 *
 * @param path 文件夹路径
 * @param recursive 是否递归
 */
async function listDir(path: string, recursive: boolean = false): Promise<FileEntry[]> {
    let result = (await ipcRenderer.invoke('file:listDir', {
        path: path,
        recursive: recursive
    })) as Result;
    if (result.code) {
        return new Promise<FileEntry[]>(resolve => {
            resolve(result.data);
        });
    } else {
        return new Promise<FileEntry[]>((resolve1, reject) => {
            reject(result.message)
        })
    }
}

/**
 * 创建文件夹
 *
 * @param path 文件夹
 * @param recursive 是否递归创建文件夹
 */
async function createDir(path: string, recursive: boolean = false): Promise<void> {
    let result = (await ipcRenderer.invoke('file:createDir', {
        path,
        recursive
    })) as Result;
    if (result.code) {
        return new Promise<void>(resolve => {
            resolve(result.data);
        });
    } else {
        return new Promise<void>((resolve1, reject) => {
            reject(result.message)
        })
    }
}

/**
 * 删除文件夹
 *
 * @param path 文件夹路径
 * @param recursive 是否递归删除
 */
async function removeDir(path: string, recursive: boolean = false): Promise<void> {
    let result = (await ipcRenderer.invoke('file:removeDir', {
        path,
        recursive
    })) as Result;
    if (result.code) {
        return new Promise<void>(resolve => {
            resolve(result.data);
        });
    } else {
        return new Promise<void>((resolve1, reject) => {
            reject(result.message)
        })
    }
}

/**
 * 将一个路径的文件，复制到新文件路径
 *
 * @param source 原始文件路径
 * @param target 新文件路径
 */
async function copyFile(source: string, target: string): Promise<void> {
    let result = (await ipcRenderer.invoke('file:copyFile', {
        source,
        target
    })) as Result;
    if (result.code) {
        return new Promise<void>(resolve => {
            resolve(result.data);
        });
    } else {
        return new Promise<void>((resolve1, reject) => {
            reject(result.message)
        })
    }
}

export default {

    /**
     * 获取默认文件夹
     */
    async defaultDir(): Promise<string> {
        let result = (await ipcRenderer.invoke('file:defaultDir')) as Result;
        if (result.code) {
            return new Promise<string>(resolve => {
                resolve(result.data);
            });
        } else {
            return new Promise<string>((resolve1, reject) => {
                reject(result.message)
            })
        }
    },

    async readFile(path: string): Promise<string> {
        let result = (await ipcRenderer.invoke('file:readFile', {
            path: path
        })) as Result;
        if (result.code) {
            return new Promise<string>(resolve => {
                resolve(result.data);
            });
        } else {
            return new Promise<string>((resolve1, reject) => {
                reject(result.message)
            })
        }
    },

    async writeFile(path: string, content: string): Promise<void> {
        let result = (await ipcRenderer.invoke('file:writeFile', {
            path,
            content
        })) as Result;
        if (result.code) {
            return new Promise<void>(resolve => {
                resolve(result.data);
            });
        } else {
            return new Promise<void>((resolve1, reject) => {
                reject(result.message)
            })
        }
    },

    async removeFile(path: string): Promise<void> {
        let result = (await ipcRenderer.invoke('file:removeFile', {
            path
        })) as Result;
        if (result.code) {
            return new Promise<void>(resolve => {
                resolve(result.data);
            });
        } else {
            return new Promise<void>((resolve1, reject) => {
                reject(result.message)
            })
        }
    },

    listDir,

    createDir,

    removeDir,

    resolve,

    /**
     * 将一个文件夹中的文件拷贝到另一个文件夹中
     *
     * @param target 目标文件夹
     * @param sources 源文件夹
     */
    async copyDir(target: string, ...sources: string[]): Promise<void> {
        // 删除目标文件夹
        await removeDir(target, true);
        // 新建目标文件夹
        await createDir(target);
        for (let source of sources) {
            // 获取源文件夹内容
            let files = await listDir(source);
            // 拷贝源文件夹内容到目标文件夹
            for (let file of files) {
                await copyFile(file.path, await resolve(target, file.name ? file.name : (new Date().getTime() + "")));
            }
        }
        return new Promise<void>((resolve) => {
            resolve();
        })
    },

    /**
     * 将文件复制到指定目录
     *
     * @param dir 目标文件夹
     * @param recursive 是否删除目标文件夹，默认删除
     * @param files 源文件
     */
    async copyFileToDir(dir: string, recursive: boolean | void, files: FileEntry[]): Promise<void> {
        if (recursive) {
            // 删除目标文件夹
            await removeDir(dir, true);
            // 新建目标文件夹
            await createDir(dir);
        }
        for (let file of files) {
            await copyFile(file.path, await resolve(dir, file.name ? file.name : (new Date().getTime() + "")));
        }
        return new Promise<void>((resolve) => {
            resolve();
        });
    }

}