<template>
    <div id="setting">
        <el-tabs v-model="settingActive">
            <el-tab-pane label="基础设置" name="basic"></el-tab-pane>
            <el-tab-pane label="图片设置" name="image"></el-tab-pane>
            <el-tab-pane label="同步设置" name="sync"></el-tab-pane>
            <el-tab-pane label="环境设置" name="environment"></el-tab-pane>
        </el-tabs>
        <div class="body">
            <el-scrollbar>
                <basic-setting v-if="settingActive === 'basic'"></basic-setting>
                <image-setting v-else-if="settingActive === 'image'"></image-setting>
                <sync-setting v-else-if="settingActive === 'sync'"></sync-setting>
                <environment-setting v-else-if="settingActive === 'environment'"></environment-setting>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import BasicSetting from "./components/BasicSetting.vue";
import ImageSetting from "./components/ImageSetting.vue";
import SyncSetting from "./components/SyncSetting.vue";
import EnvironmentSetting from "./components/EnvironmentSetting.vue";

export default defineComponent({
    name: 'setting',
    components: { BasicSetting, SyncSetting, EnvironmentSetting, ImageSetting },
    data: () => ({
        settingActive: 'blog'
    }),
});
</script>
<style scoped lang="less">
#setting {
    position: absolute;
    top: 40px;
    left: 10px;
    right: 10px;
    bottom: 10px;

    .body {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 10px;
    }
}
</style>