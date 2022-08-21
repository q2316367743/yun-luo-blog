export default interface FileEntry {

    path: string;
    /**
     * Name of the directory/file
     * can be null if the path terminates with `..`
     */
    name?: string;
    /** Children of this entry if it's a directory; null otherwise */
    isDirectory?: boolean;

    /**
     * 子文件夹
     */
    children?: Array<FileEntry>;
    
}