import DialogFilter from "@/api/entities/DialogFilter";

/**
 * Options for the open dialog.
 * */
export default interface OpenDialogOptions {

    /** The title of the dialog window. */
    title?: string;
    /** The filters of the dialog. */
    filters?: DialogFilter[];
    /** Initial directory or file path. */
    defaultPath?: string;
    /** Whether the dialog allows multiple selection or not. */
    multiple?: boolean;
    /** Whether the dialog is a directory selection or not. */
    directory?: boolean;
    /**
     * If `directory` is true, indicates that it will be read recursively later.
     * Defines whether subdirectories will be allowed on the scope or not.
     */
    recursive?: boolean;

}