<template>
    <el-form label-width="140px">
        <el-form-item label="服务器端口号">
            <el-input-number :min="1" :max="65535" v-model="serverSetting.port" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="更新是否同步">
            <el-switch v-model="serverSetting.updateBySync" active-text="true" inactive-text="false"
                       :active-value="true" :inactive-value="false"/>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import ServerSetting from "@/entities/setting/ServerSetting";
import {settingService} from "@/global/BeanFactory";
import {ElMessage} from "element-plus";

export default defineComponent({
    name: 'server-setting',
    data: () => ({
        serverSetting: {} as ServerSetting,
    }),
    created() {
        this.serverSetting = settingService.getServer();
    },
    methods: {
        save() {
            settingService.saveServer(this.serverSetting).then(() => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: '服务器设置 - 保存成功'
                })
            }).catch(e => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '服务器设置 - 保存失败，' + e
                });
            });
        }
    }
});
</script>
<style scoped>

</style>