import {
    BaseDirectory,
    createDir,
    FileEntry,
    readBinaryFile,
    readDir,
    readTextFile,
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
        return createDir(dir);
    },

    /**
     * 解析目录
     *
     * @param paths 目录
     */
    resolve(...paths: string[]): Promise<string> {
        return resolve(...paths);
    }

}