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
    }
}