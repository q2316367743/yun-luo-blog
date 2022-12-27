import ServerService from "@/service/ServerService";
import SettingService from "@/service/SettingService";
import TerminalService from "@/service/TerminalService";

import HintService from "@/service/HintService";
import {useDark, useToggle} from "@vueuse/core";



export const terminalService = new TerminalService();
export const serverService = new ServerService();
export const hintService = new HintService();

export const settingService = new SettingService();


// 暗黑模式
export const isDark = useDark({
    selector: 'body',
    attribute: 'dark-mode',
    valueDark: 'dark',
    valueLight: 'light'
});
export const toggleDark = useToggle(isDark);