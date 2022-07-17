export default {
    contains(arr: any[], keyword: any): boolean {
        for (let item of arr) {
            if (item === keyword) {
                return true;
            }
        }
        return false;
    }
}