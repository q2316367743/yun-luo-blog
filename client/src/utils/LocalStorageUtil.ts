export default {

    get(name: string): any | undefined {
        let value = localStorage.getItem(name);
        if (value) {
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        } else {
            return undefined;
        }
    },

    getOrDefault<T>(name: string, defaultValue: T | string | number): T {
        let value = localStorage.getItem(name);
        if (!value) {
            return defaultValue as any;
        } else {
            try {
                if (typeof defaultValue as any === 'object') {
                    return JSON.parse(value);
                } else if (typeof defaultValue as any === "string") {
                    return value as any;
                } else if (typeof defaultValue as any === "number") {
                    if (value.indexOf('.') > -1) {
                        return parseFloat(value) as any;
                    } else {
                        return parseInt(value) as any;
                    }
                } else {
                    return defaultValue as any;
                }
            } catch (e) {
                return value as any;
            }
        }
    },

    set<T>(name: string, value: T) {
        if (typeof value === 'object') {
            localStorage.setItem(name, JSON.stringify(value));
        } else {
            localStorage.setItem(name, value as any);
        }
    }

}