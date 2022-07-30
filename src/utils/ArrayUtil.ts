export default {
    contains(arr: any[], keyword: any): boolean {
        try {
            for (let item of arr) {
                if (item === keyword) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    },
    /**
     * 将一个数组变为map
     * 
     * @param arr 数组
     * @param attrName 属性名
     * @param merge key冲突合并解决办法
     * @returns map结果
     */
    map<T, K extends keyof T>(arr: T[], attrName: K, merge?: (item1: T, item2: T) => T): Map<any, T> {
        let result = new Map<string, T>();
        for (let item of arr) {
            // @ts-ignore
            if (result.has(item[attrName])) {
                if (merge) {
                    // @ts-ignore
                    result.set(item[attrName], merge(result.get(item[attrName]), item));
                } else {
                    throw new Error('未设置合并方法，无法合并相同key');
                }
            } else {
                // @ts-ignore
                result.set(item[attrName], item);
            }
        }
        return result;
    },
    /**
     * 根据指定属性名对数组进行分组
     * 
     * @param arr 数据
     * @param attrName 属性名
     * @returns 分组后的结果
     */
    group<T, K extends keyof T>(arr: T[], attrName: K): Map<any, T[]> {
        let result = new Map<any, T[]>();
        for (let item of arr) {
            if (result.has(item[attrName])) {
                result.get(item[attrName])?.push(item);
            } else {
                result.set(item[attrName], [item]);
            }
        }
        return result;
    },

    /**
     * 根据指定的属性名进行统计数量
     *
     * @param arr 数据
     * @param attrName 属性名
     * @return 属性 -> 数量
     */
    count<T, K extends keyof T>(arr: T[], attrName: K): Map<any, number> {
        let result = new Map<any, number>();
        for (let item of arr) {
            if (result.has(item[attrName])) {
                result.set(item[attrName], result.get(item[attrName])! + 1);
            } else {
                result.set(item[attrName], 1);
            }
        }
        return result;
    }

}