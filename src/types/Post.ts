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

/**
 * hexo文档: https://hexo.io/zh-cn/docs/front-matter
 */
export interface Post {

    /**
     * 文章标题
     */
    title: string;

    /**
     * 文件名
     */
    fileName: string;

    /**
     * 文件路径
     */
    path: string;

    /**
     * 文章状态
     */
    status: PostStatus;

    /**
     * 建立日期 - 文件建立日期，时间戳
     */
    date: number;

    /**
     * 更新日期 - 文件更新日期，时间戳
     */
    updated: number;

    /**
     * 开启文章的评论功能
     */
    comments: boolean;

    /**
     * 标签
     */
    tags: Array<string>;

    /**
     * 分类
     */
    categories: Array<string>;

    /**
     * 覆盖文章网址
     */
    permalink: string;

    /**
     * Page excerpt in plain text. Use <a href="https://hexo.io/docs/tag-plugins#Post-Excerpt">this plugin</a> to format the text
     */
    excerpt: string;

    /**
     * Disable rendering of Nunjucks tag {{ }}/{% %} and <a href="https://hexo.io/docs/tag-plugins">tag plugins</a> when enabled
     */
    disableNunjucks: string;

    /**
     * Set the language to override <a href="https://hexo.io/docs/internationalization#Path">auto-detection</a>
     * 
     * @default Inherited from _config.yml
     */
    lang: string;

    /**
     * 内容
     */
    content?: string;

}