import Constant from "@/global/Constant";
import FileUtil from "@/utils/FileUtil";

export async function verifyDirExistByBase(dir: string): Promise<boolean> {
    let files = await FileUtil.listDir(Constant.PATH.BASE);
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