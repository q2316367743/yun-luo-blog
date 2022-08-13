<template>
    <div id="setting">
        <el-collapse v-model="settingActive">
            <el-collapse-item title="基础设置" name="basic">
                <basic-setting></basic-setting>
            </el-collapse-item>
            <el-collapse-item title="图片设置" name="image">
                <image-setting></image-setting>
            </el-collapse-item>
            <el-collapse-item title="服务器设置" name="sync">
                <server-setting></server-setting>
            </el-collapse-item>
            <el-collapse-item title="环境设置" name="environment">
                <environment-setting></environment-setting>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import BasicSetting from "./components/BasicSetting.vue";
import ImageSetting from "./components/ImageSetting.vue";
import ServerSetting from "./components/ServerSetting.vue";
import EnvironmentSetting from "./components/EnvironmentSetting.vue";

export default defineComponent({
    name: 'setting',
    components: {BasicSetting, ServerSetting, EnvironmentSetting, ImageSetting},
    data: () => ({
        settingActive: 'basic'
    }),
});
</script>
<style scoped lang="less">
#setting{
    .el-input {
        width: 300px;
    }
}
</style>