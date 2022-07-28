/**
 * 分类
 */
export default interface Category {

    /**
     * ID
     */
    id?: number;

    /**
     * 分类名称
     */
    name: string;

    /**
     * 父级ID
     */
    parentId: number;

    /**
     * 创建时间
     */
    createTime: Date;

    /**
     * 更新时间
     */
    updateTime: Date;

}