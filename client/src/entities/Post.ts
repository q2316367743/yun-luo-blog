/**
 * hexo文档: https://hexo.io/zh-cn/docs/front-matter
 */
export default interface Post {

    /**
     * ID
     */
    id?: number;

    /**
     * 文章标题
     */
    title: string;

    /**
     * 文件名
     */
    fileName: string;

    /**
     * 布局
     */
    layout: string,

    /**
     * 文章状态
     */
    status: number;

    /**
     * 建立日期 - 文件建立日期，时间戳
     */
    date: string;

    /**
     * 更新日期 - 文件更新日期，时间戳
     */
    updated: string;

    /**
     * 开启文章的评论功能
     */
    comments: boolean;

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

}