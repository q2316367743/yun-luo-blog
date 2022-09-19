<template>
    <div id="setting">
        <el-scrollbar>
            <div class="setting-header">设置</div>
            <setting-item @click="settingActive = 'basic'">基础设置</setting-item>
            <setting-item @click="settingActive = 'image'">图床设置</setting-item>
            <setting-item @click="settingActive = 'sync'">同步设置</setting-item>
        </el-scrollbar>
        <div class="sub-setting" :style="settingActive !== '' ? 'transform: translateX(-460px);' : ''">
            <el-page-header title="设置" :content="currentSetting" @back="goBack" style="margin-bottom: 24px;"/>
            <basic-setting v-if="settingActive === 'basic'"/>
            <image-setting v-else-if="settingActive === 'image'"/>
            <server-setting v-else-if="settingActive === 'sync'"/>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import BasicSetting from "./pages/BasicSetting.vue";
import ImageSetting from "./pages/ImageSetting.vue";
import ServerSetting from "./pages/ServerSetting.vue";

import SettingItem from './components/SettingItem.vue';

export default defineComponent({
    name: 'setting',
    components: {BasicSetting, ServerSetting, ImageSetting, SettingItem},
    data: () => ({
        settingActive: ''
    }),
    computed: {
        currentSetting() {
            switch (this.settingActive) {
                case "basic":
                    return "基础设置";
                case "image":
                    return "图床设置";
                case "sync":
                    return "同步设置";
                default:
                    return ""
            }
        }
    },
    methods: {
        goBack() {
            this.settingActive = '';
        }
    }
});
</script>
<style scoped lang="less">
#setting {
    width: 460px;
    position: relative;
    height: 100%;
    overflow-x: hidden;

    .setting-header {
        height: 24px;
        width: 100%;
        text-align: center;
        font-size: 18px;
        margin-bottom: 16px;
    }

    .el-input {
        width: 200px;
    }

    .sub-setting {
        position: absolute;
        top: 0;
        left: 460px;
        bottom: 0;
        width: 460px;
        transition: 0.5s;
        z-index: 1;
        background-color: #ffffff;
    }
}
</style>