import FileApi from "@/api/FileApi";
import ArrayUtil from "@/utils/ArrayUtil";

export default class Database<T> {

    path: string;

    constructor(path: string) {
        this.path = path;
    }

    /**
     * 返回全部数据
     */
    async list(): Promise<Array<T>> {
        let result = new Array<T>();
        let content = ""
        try {
            content = await FileApi.readFile(this.path);
            let items = JSON.parse(content) as any[];
            for (let item of items) {
                result.push(item)
            }
        } catch (e) {
            console.error(e);
        }
        return Promise.resolve(result);
    }

    async count<A extends keyof T>(attr: A, value: any): Promise<number> {
        let items = await this.list();
        let count = 0;
        for (let item of items) {
            if (item[attr] === value) {
                count += 1;
            }
        }
        return Promise.resolve(count);
    }

    /**
     * 插入一条记录
     * @param record 记录
     * @return 新的ID
     */
    async insert(record: T): Promise<number> {
        let id = new Date().getTime();
        // @ts-ignore
        record.id = id;
        let items = await this.list();
        items.push(record);
        await FileApi.writeFile(this.path, JSON.stringify(items));
        return Promise.resolve(id);
    }

    /**
     * 批量插入记录
     * @param records 多条记录
     */
    async insertBatch(records: Array<T>): Promise<void> {
        for (let record of records) {
            await this.insert(record);
        }
        return Promise.resolve();
    }

    /**
     * 更新一条记录，记录中必须存在ID
     *
     * @param record 记录
     */
    async update(record: T): Promise<void> {
        // @ts-ignore
        let id = record.id;
        if (!id) {
            return Promise.reject('ID不存在，无法更新');
        }
        let records = new Array<T>();
        let items = await this.list();
        for (let item of items) {
            // @ts-ignore
            if (item.id === id) {
                records.push(record);
            } else {
                records.push(item);
            }
        }
        return FileApi.writeFile(this.path, JSON.stringify(items));
    }

    /**
     * 根据ID删除多条记录
     *
     * @param ids 多条记录ID
     */
    async delete(ids: Array<number>): Promise<void> {
        let records = new Array<T>();
        let items = await this.list();
        for (let item of items) {
            // @ts-ignore
            if (!ArrayUtil.contains(ids, item.id)) {
                records.push(item);
            }
        }
        return FileApi.writeFile(this.path, JSON.stringify(items));
    }

}