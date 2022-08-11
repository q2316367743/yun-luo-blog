import {createI18n} from 'vue-i18n'
import zhCn from "@/i18n/language/zhCn.json";
import enUs from "@/i18n/language/enUs.json";

const i18n = createI18n({
    fallbackLocale: 'zhCn',
    globalInjection: true,
    legacy: false,
    locale: "zhCn",
    messages: {
        zhCn,
        enUs
    }
});

export default i18n