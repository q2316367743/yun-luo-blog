export default {

    /**
     * 将一个对象拷贝到另一个对象上，不存在不拷贝，以目标对象为主
     * @param source
     * @param target
     */
    assignWithTarget<T>(source: any, target: T): T {
        if (!source) {
            return target;
        }
        for (let key of Object.keys(target)) {
            if (source[key]) {
                // @ts-ignore
                target[key] = source[key];
            }
        }
        return target;
    },

    /**
     * 将多个对象进行合并
     *
     * @param sources 多个对象
     */
    merge(...sources: any[]): any {
        let target = {} as any;
        for (let source of sources) {
            for (let key of Object.keys(source)) {
                target[key] = source[key];
            }
        }
        return target;
    }
}
