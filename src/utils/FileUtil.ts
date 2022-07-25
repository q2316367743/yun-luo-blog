import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs';

export default {

    readFile(path: string): Promise<string> {
        return readTextFile(path, {
            dir: BaseDirectory.Document
        })
    }

}