import Constant from "@/global/Constant";
import { readDir } from "@tauri-apps/api/fs";

export async function verifyDirExistByBase(dir: string): Promise<boolean> {
    let files = await readDir(Constant.PATH.BASE);
    for (let file of files) {
        if (file.children) {
            // 文件夹
            if (file.name === dir) {
                return new Promise<boolean>((resolve, reject) => {
                    resolve(true);
                });
            }
        }
    }
    return new Promise<boolean>((resolve, reject) => {
        resolve(false);
    });
}