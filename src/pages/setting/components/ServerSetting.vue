<template>
    <el-form label-width="140px">
        <el-form-item label="服务器端口号">
            <el-input-number :min="1" :max="65535" v-model="serverSetting.port" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="更新是否同步">
            <el-switch v-model="serverSetting.updateBySync" active-text="true" inactive-text="false"
                       :active-value="true" :inactive-value="false"/>
        </el-form-item>
        <el-form-item label="同步成功是否通知">
            <el-switch v-model="serverSetting.noticeBySyncWithSuccess" active-text="true" inactive-text="false"
                       :active-value="true" :inactive-value="false"/>
        </el-form-item>
        <el-form-item label="同步错误是否通知">
            <el-switch v-model="serverSetting.noticeBySyncWithError" active-text="true" inactive-text="false"
                       :active-value="true" :inactive-value="false"/>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {useSettingStore} from "@/store/SettingStore";

export default defineComponent({
    name: 'server-setting',
    data: () => ({
        serverSetting: useSettingStore().serverSetting,
    })
});
</script>
<style scoped>

</style>