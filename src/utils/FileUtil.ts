import {
    BaseDirectory,
    copyFile,
    createDir,
    FileEntry,
    readBinaryFile,
    readDir,
    readTextFile,
    removeDir,
    removeFile,
    writeBinaryFile,
    writeTextFile
} from '@tauri-apps/api/fs';
import {resolve} from "@tauri-apps/api/path";

export default {

    readFile(path: string): Promise<string> {
        return readTextFile(path, {
            dir: BaseDirectory.Document
        })
    },

    writeFile(path: string, content: string): Promise<void> {
        return writeTextFile(path, content, {
            dir: BaseDirectory.Document
        });
    },

    readBinaryFile(path: string): Promise<Uint8Array> {
        return readBinaryFile(path, {
            dir: BaseDirectory.Document
        });
    },

    writeBinaryFile(path: string, content: Uint8Array): Promise<void> {
        return writeBinaryFile(path, content, {
            dir: BaseDirectory.Document
        })
    },

    removeFile(path: string): Promise<void> {
        return removeFile(path, {
            dir: BaseDirectory.Document
        });
    },

    /**
     * 遍历文件夹
     * @param dir 文件夹
     * @param recursive 是否递归解析
     */
    listDir(dir: string, recursive: boolean = false): Promise<FileEntry[]> {
        return readDir(dir,
            {
                dir: BaseDirectory.Document,
                recursive: recursive
            });
    },

    createDir(dir: string): Promise<void> {
        return createDir(dir, {
            recursive: true,
            dir: BaseDirectory.Document
        });
    },

    removeDir(path: string): Promise<void> {
        return removeDir(path, {
            dir: BaseDirectory.Document,
            recursive: true
        });
    },

    /**
     * 解析目录
     *
     * @param paths 目录
     */
    resolve(...paths: string[]): Promise<string> {
        return resolve(...paths);
    },

    /**
     * 将一个文件夹中的文件拷贝到另一个文件夹中
     *
     * @param target 目标文件夹
     * @param sources 源文件夹
     */
    async copyDir(target: string, ...sources: string[]): Promise<void> {
        // 删除目标文件夹
        await removeDir(target, {
            dir: BaseDirectory.Document,
            recursive: true
        });
        // 新建目标文件夹
        await createDir(target, {
            dir: BaseDirectory.Document
        });
        for (let source of sources) {
            // 获取源文件夹内容
            let files = await readDir(source, {
                dir: BaseDirectory.Document
            });
            // 拷贝源文件夹内容到目标文件夹
            for (let file of files) {
                await copyFile(file.path, await resolve(target, file.name ? file.name : (new Date().getTime() + "")), {
                    dir: BaseDirectory.Document
                });
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
            await removeDir(dir, {
                dir: BaseDirectory.Document,
                recursive: true
            });
            // 新建目标文件夹
            await createDir(dir, {
                dir: BaseDirectory.Document
            });
        }
        for (let file of files) {
            await copyFile(file.path, await resolve(dir, file.name ? file.name : (new Date().getTime() + "")), {
                dir: BaseDirectory.Document
            });
        }
        return new Promise<void>((resolve) => {
            resolve();
        });
    }

}