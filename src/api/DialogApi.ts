import OpenDialogOptions from "@/api/entities/OpenDialogOptions";
import { open } from '@tauri-apps/api/dialog';

export default {

    open(options?: OpenDialogOptions): Promise<null | string | string[]> {
        return open(options);
    }

}