import jsYaml from 'js-yaml';

// # Hexo Configuration
// ## Docs: https://hexo.io/docs/configuration.html
// ## Source: https://github.com/hexojs/hexo/
export default class Hexo {

    // 网站

    /**
     * 网站标题
     */
    title: string = "";

    /**
     * 网站副标题
     */
    subtitle: string = "";

    /**
     * 网站描述
     */
    description: string = "";

    /**
     * 网站的关键词。支持多个关键词。
     */
    keywords: Array<string> = new Array<string>();

    /**
     * 您的名字
     */
    author: string = "";

    /**
     * 网站使用的语言。
     * 对于简体中文用户来说，使用不同的主题可能需要设置成不同的值，请参考你的主题的文档自行设置，常见的有 zh-Hans和 zh-CN。
     */
    language: string = "zh-CN";

    /**
     * 网站时区。Hexo 默认使用您电脑的时区。
     * 请参考<a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones">时区列表</a>进行设置，
     * 如 America/New_York, Japan, 和 UTC 。
     * 一般的，对于中国大陆地区可以使用 Asia/Shanghai。
     */
    timezone: string = "Asia/Shanghai";

    // 网址

    /**
     * 网址, 必须以 http:// 或 https:// 开头
     */
    url: string = "http://localhost";

    /**
     * 网站根目录
     */
    root: string = "";

    /**
     *    文章的<a href="https://hexo.io/zh-cn/docs/permalinks">永久链接</a>格式
     */
    permalink: string = ":year/:month/:day/:title/";

    /**
     * 永久链接中各部分的默认值
     */
    permalink_defaults: string = "";

    /**
     *    改写<a href="https://hexo.io/zh-cn/docs/variables">permalink</a>的值来美化 URL
     */
    pretty_urls: {

        /**
         * 是否在永久链接中保留尾部的 index.html，设置为 false 时去除
         */
        trailing_index: boolean;

        /**
         * 是否在永久链接中保留尾部的 .html, 设置为 false 时去除 (对尾部的 index.html无效)
         */
        trailing_html: boolean
    } = {
        trailing_index: true,

        trailing_html: true
    };

    // 目录

    /**
     * 资源文件夹，这个文件夹用来存放内容。
     */
    source_dir: string = "source";

    /**
     * 公共文件夹，这个文件夹用于存放生成的站点文件。
     */
    public_dir: string = "public";

    /**
     * 标签文件夹
     */
    tag_dir: string = "tags";

    /**
     * 归档文件夹
     */
    archive_dir: string = "archives";

    /**
     * 分类文件夹
     */
    category_dir: string = "categories";

    /**
     * Include code 文件夹，source_dir 下的子目录
     */
    code_dir: string = "downloads/code";

    /**
     * 国际化（i18n）文件夹
     */
    i18n_dir: string = ":lang";

    /**
     * 跳过指定文件的渲染。匹配到的文件将会被不做改动地复制到 public 目录中。
     * 您可使用<a href="https://github.com/micromatch/micromatch#extended-globbing">glob</a>表达式来匹配路径。
     */
    skip_render: string = "";

    // 文章

    /**
     * 新文章的文件名称
     */
    new_post_name: string = ":title.md";

    /**
     * 预设布局
     */
    default_layout: string = "post";

    /**
     * 在中文和英文之间加入空格
     */
    auto_spacing: boolean = false;

    /**
     *    把标题转换为 title case
     */
    titlecase: boolean = false;

    external_link: {

        /**
         * 在新标签中打开链接
         */
        enable: boolean;

        /**
         * 对整个网站（site）生效或仅对文章（post）生效
         */
        field: string;

        /**
         * 需要排除的域名。主域名和子域名如 www 需分别配置
         */
        exclude: Array<string>;

    } = {
        enable: true,
        field: 'site',
        exclude: new Array<string>()
    };

    /**
     * 把文件名称转换为 (1) 小写或 (2) 大写
     */
    filename_case: number = 0;

    /**
     * 显示草稿
     */
    render_drafts: boolean = false;

    /**
     * 启动<a href="https://hexo.io/zh-cn/docs/asset-folders">Asset 文件夹</a>
     */
    post_asset_folder: boolean = false;

    /**
     * 把链接改为与根目录的相对位址
     */
    relative_link: boolean = false;

    /**
     * 显示未来的文章
     */
    future: boolean = true;

    highlight: {
        enable: boolean
        line_number: boolean
        auto_detect: boolean
        tab_replace: string
        wrap: boolean
        hljs: boolean
    } = {
        enable: true,
        line_number: true,
        auto_detect: false,
        tab_replace: '',
        wrap: true,
        hljs: false,
    };

    prismjs: {
        enable: boolean
        preprocess: boolean
        line_number: boolean
        tab_replace: string
    } = {

        enable: false,
        preprocess: true,
        line_number: true,
        tab_replace: '',
    }


    // 分类 & 标签

    /**
     * 默认分类
     */
    default_category: string = "uncategorized";

    /**
     * 分类别名
     */
    category_map: string = "";

    /**
     * 标签别名
     */
    tag_map: string = "";

    // 日期 / 时间格式

    /**
     * 日期格式
     */
    date_format: string = "YYYY-MM-DD";

    /**
     * 时间格式
     */
    time_format: string = "HH:mm:ss";

    /**
     *    当 Front Matter 中没有指定
     * <a href="https://hexo.io/zh-cn/docs/variables#%E9%A1%B5%E9%9D%A2%E5%8F%98%E9%87%8F">updated</a> 时
     * updated 的取值
     */
    updated_option: string = "mtime";

    // 分页

    /**
     * 每页显示的文章量 (0 = 关闭分页功能)
     */
    per_page: number = 10;

    /**
     * 分页目录
     */
    pagination_dir: string = "page";

    // 包括或不包括目录和文件

    /**
     * Hexo 默认会不包括 source/ 下的文件和文件夹（包括名称以下划线和 . 开头的文件和文件夹，
     * Hexo 的 _posts 和 _data 等目录除外）。
     * 通过设置此字段将使 Hexo 处理他们并将它们复制到 source 目录下。
     */
    include: Array<string> = new Array<string>();

    /**
     * Hexo 不包括 source/ 下的这些文件和目录
     */
    exclude: Array<string> = new Array<string>();

    /**
     * Hexo 会忽略整个 Hexo 项目下的这些文件夹或文件
     */
    ignore: Array<string> = new Array<string>();

    // 拓展
    //  Plugins: https://hexo.io/plugins/
    //  Themes: https://hexo.io/themes/

    /**
     * 主题
     */
    theme: string = "landscape";

    constructor(fileContent: string | void) {
        if (fileContent && fileContent !== '') {
            // 解析文件内容
            let yaml = jsYaml.load(fileContent);
            Object.assign(this, yaml);
        }
    }

    /**
     * 解析文件内容
     *
     * @param fileContent 文件内容
     */
    parse(fileContent: string) {
        if (fileContent && fileContent !== '') {
            let yaml = jsYaml.load(fileContent);
            Object.assign(this, yaml);
        }
    }

    /**
     * 渲染内容
     */
    render(): string {
        return jsYaml.dump(this, {
            indent: 2
        });
    }

}