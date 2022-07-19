<template>
    <div id="setting">
        <el-tabs v-model="settingActive">
            <el-tab-pane label="博客设置" name="blog"></el-tab-pane>
            <el-tab-pane label="图片设置" name="image"></el-tab-pane>
            <el-tab-pane label="同步设置" name="sync"></el-tab-pane>
            <el-tab-pane label="环境设置" name="environment"></el-tab-pane>
        </el-tabs>
        <div class="body">
            <el-scrollbar>
                <blog-setting v-if="settingActive === 'blog'"></blog-setting>
                <image-setting v-else-if="settingActive === 'image'"></image-setting>
                <sync-setting v-else-if="settingActive === 'sync'"></sync-setting>
                <environment-setting v-else-if="settingActive === 'environment'"></environment-setting>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import BlogSetting from "./components/BlogSetting.vue";
import ImageSetting from "./components/ImageSetting.vue";
import SyncSetting from "./components/SyncSetting.vue";
import EnvironmentSetting from "./components/EnvironmentSetting.vue";

export default defineComponent({
    name: 'setting',
    components: { BlogSetting, SyncSetting, EnvironmentSetting, ImageSetting },
    data: () => ({
        settingActive: 'blog'
    }),
});
</script>
<style scoped lang="less">
#setting {
    position: absolute;
    top: 10px;
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