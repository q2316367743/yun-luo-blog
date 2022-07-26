import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';

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
    }

}