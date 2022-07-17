export enum PostStatus {

    /**
     * 草稿
     */
    DRAFT = 1,

    /**
     * 发布
     */
    RELEASE = 2,

    /**
     * 回收站
     */
    RECYCLE = 3

}

export interface Post {

    /**
     * 文件名
     */
    name: string;

    /**
     * 文件路径
     */
    path: string;

    /**
     * 文章状态
     */
    status: PostStatus;

    /**
     * 最后修改时间
     */
    updateTime: Date;

    /**
     * 标签
     */
    tag: Array<string>;

    /**
     * 分类
     */
     category: Array<string>;

}