import DialogFilter from "@/api/entities/DialogFilter";

/**
 * Options for the open dialog.
 * */
export default interface OpenDialogOptions {

    /**
     * 对话窗口的标题。
     * */
    title?: string;

    /**
     * 对话框的过滤器。
     * */
    filters?: DialogFilter[];

    /**
     * 初始目录或文件路径。
     * */
    defaultPath?: string;

    /**
     * 对话框是否允许多选。
     * */
    multiple?: boolean;

    /**
     * 对话框是否为目录选择。
     * */
    directory?: boolean;

    /**
     * 如果`directory`为真，表示后面会递归读取。定义是否允许范围内的子目录。
     */
    recursive?: boolean;

}