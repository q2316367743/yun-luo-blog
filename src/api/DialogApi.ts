import OpenDialogOptions from "@/api/entities/OpenDialogOptions";

export default {

    open(options?: OpenDialogOptions): Promise<null | string | string[]> {
        return new Promise<string | string[] | null>(resolve => {
            resolve(null);
        });
    }

}