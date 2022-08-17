export default {

    get(name: string): any | undefined{
        let value = localStorage.getItem(name);
        if (value) {
            try {
                return JSON.parse(value);
            }catch (e) {
                return value;
            }
        }else {
            return undefined;
        }
    },

    getOrDefault<T>(name: string, defaultValue: T): T {
        let value = localStorage.getItem(name);
        if (!value) {
            return defaultValue;
        }else {
            try {
                return JSON.parse(value);
            }catch (e) {
                console.error(e);
                return defaultValue;
            }
        }
    },

    set<T>(name: string, value: T) {
        if (typeof value === 'string') {
            localStorage.setItem(name, value.toString());
        }else {
            localStorage.setItem(name, JSON.stringify(value));
        }
    }

}