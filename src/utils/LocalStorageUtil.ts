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

    getOrDefault<T>(name: string, defaultValue: T | string | number): T | string | number {
        let value = localStorage.getItem(name);
        if (!value) {
            return defaultValue;
        }else {
            try {
                if (typeof defaultValue === 'object') {
                    return JSON.parse(value);
                }else if (typeof defaultValue === "string") {
                    return value;
                }else {
                    if (value.indexOf('.') > -1) {
                        return parseFloat(value);
                    } else {
                        return parseInt(value)
                    }
                }
            }catch (e) {
                return value as any;
            }
        }
    },

    set<T>(name: string, value: T) {
        if (typeof value === 'object') {
            localStorage.setItem(name, JSON.stringify(value));
        }else {
            localStorage.setItem(name, value as any);
        }
    }

}