import Entry from "@/global/Entry";

export default interface SiteSetting {

    /**
     * 当前站点
     */
    active: Entry;

    /**
     * 站点历史
     */
    history: Array<Entry>

}