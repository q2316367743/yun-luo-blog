import FileApi from "@/api/FileApi";
import ArrayUtil from "@/utils/ArrayUtil";

export default class Database<T> {

    private records: Array<T>;
    private path: string;

    constructor(path: string) {
        this.path = path;
        this.records = new Array<T>();
    }

    setPath(path: string): Promise<void> {
        this.path = path;
        return this.init()
    }

    private async init(): Promise<void> {
        this.records = new Array<T>();
        try {
            let content = await FileApi.readFile(this.path);
            let items = JSON.parse(content) as any[]
            for (let item of items) {
                this.records.push(item);
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async save(): Promise<void> {
        return FileApi.writeFile(this.path, JSON.stringify(this.records));
    }

    /**
     * 返回全部数据
     */
    list(where?: Partial<T>): Array<T> {
        let result = new Array<T>();
        try {
            for (let item of this.records) {
                if (where) {
                    let flag = true;
                    for (let key of Object.keys(where)) {
                        // @ts-ignore
                        if (item[key] !== where[key]) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        result.push(item)
                    }
                } else {
                    result.push(item)
                }
            }
        } catch (e) {
            console.error(e);
        }
        return result;
    }

    /**
     * 根据条件查询数量
     *
     * @param where 查询条件
     */
    count(where?: Partial<T>): number {
        let items = this.list(where);
        return items ? items.length : 0;
    }

    /**
     * 根据条件查询一个数据
     *
     * @param where 查询条件
     */
    one(where?: Partial<T>): T | undefined {
        let items = this.list(where);
        if (items && items.length > 0) {
            return items[0];
        }
        return undefined;
    }

    info(id: number): T | void {
        for (let record of this.records) {
            // @ts-ignore
            if (record.id && record.id === id) {
                return record;
            }
        }
        return undefined;
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
        this.records.push(record);
        await this.save();
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
        for (let item of this.records) {
            // @ts-ignore
            if (item.id === id) {
                records.push(record);
            } else {
                records.push(item);
            }
        }
        this.records = records;
        return this.save();
    }

    /**
     * 根据ID删除多条记录
     *
     * @param ids 多条记录ID
     */
    async delete(...ids: Array<number>): Promise<void> {
        let records = new Array<T>();
        let items = this.records;
        for (let item of items) {
            // @ts-ignore
            if (!ArrayUtil.contains(ids, item.id)) {
                records.push(item);
            }
        }
        this.records = records;
        return this.save();
    }

    async deleteWhere(where?: Partial<T>): Promise<number> {
        let items = this.list(where);
        if (items && items.length > 0) {
            for (let item of items) {
                // @ts-ignore
                await this.delete(item.id);
            }
        }
        return Promise.resolve(items ? items.length : 0);
    }

}