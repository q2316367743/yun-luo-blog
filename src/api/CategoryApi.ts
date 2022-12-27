import CategoryView from "@/views/CategoryView";

export default {
    async list(): Promise<Array<CategoryView>> {
        return Promise.resolve([]);
    },

    async deleteById(id: number): Promise<void> {

    }
}