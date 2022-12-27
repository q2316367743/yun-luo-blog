import TagView from "@/views/TagView";

export default {
    async list(): Promise<Array<TagView>> {
        return Promise.resolve([]);
    },
    async deleteById(id: number): Promise<void> {

    },
    async update(id: number, name: string): Promise<void> {

    }
}