<template>
    <div id="setting">
        <el-tabs v-model="settingActive">
            <el-tab-pane label="基础设置" name="basic"></el-tab-pane>
            <el-tab-pane label="同步设置" name="sync"></el-tab-pane>
        </el-tabs>
        <div class="body">
            <el-scrollbar>
                <basic-setting v-show="settingActive === 'basic'"></basic-setting>
                <sync-setting v-show="settingActive === 'sync'"></sync-setting>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BasicSetting from "./components/BasicSetting.vue";
import SyncSetting from "./components/SyncSetting.vue";

export default defineComponent({
    name: 'setting',
    components: { BasicSetting, SyncSetting },
    data: () => ({
        settingActive: 'basic'
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