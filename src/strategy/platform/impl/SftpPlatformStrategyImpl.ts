import PlatformStrategy from "@/strategy/platform/PlatformStrategy";

export default class SftpPlatformStrategyImpl implements PlatformStrategy {

    push(): Promise<void> {
        return Promise.reject("暂不支持");
    }

}
