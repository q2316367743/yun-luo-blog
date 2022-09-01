export default interface Environment {

    /**
     * 环境ID
     */
    id: number;

    /**
     * 环境名称
     */
    name: string;

    /**
     * node路径
     */
    nodePath: string;

    /**
     * NPM路径
     */
    npmPath: string;

    /**
     * HEXO命令路径
     */
    hexoPath: string;

    /**
     * git目录
     */
    gitPath: string;

    /**
     * NPM镜像(https://registry.npmmirror.com)
     */
    npmMirror: string;

}