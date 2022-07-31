import Constant from "@/global/Constant";
import FileUtil from "@/utils/FileUtil";

export async function verifyDirExistByBase(dir: string): Promise<boolean> {
    let basePath = await Constant.PATH.BASE();
    let files = await FileUtil.listDir(basePath);
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