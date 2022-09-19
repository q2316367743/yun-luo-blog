<template>
    <el-form label-width="160px">
        <el-form-item label="未使用图床">
            <el-switch v-model="hintSetting.localImage" active-text="true" inactive-text="false"
                       :active-value="true" :inactive-value="false"/>
        </el-form-item>
        <el-form-item label="服务器更新开始">
            <el-switch v-model="hintSetting.updateServerStart" active-text="true" inactive-text="false"
                       :active-value="true" :inactive-value="false"/>
        </el-form-item>
        <el-form-item label="服务器更新完成是否通知">
            <el-switch v-model="hintSetting.updateServerComplete" active-text="true" inactive-text="false"
                       :active-value="true" :inactive-value="false"/>
        </el-form-item>
        <el-form-item label="服务器更新错误是否通知">
            <el-switch v-model="hintSetting.updateServerError" active-text="true" inactive-text="false"
                       :active-value="true" :inactive-value="false"/>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import HintSetting from "@/entities/setting/HintSetting";
import {hintService} from "@/global/BeanFactory";
import {ElMessage} from "element-plus";

export default defineComponent({
    name: 'hint-setting',
    data: () => ({
        hintSetting: {} as HintSetting,
    }),
    created() {
        this.hintSetting = hintService.getHintSetting();
    },
    methods: {
        save() {
            hintService.setHintSetting(this.hintSetting).then(() => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: '提示设置 - 保存成功'
                })
            }).catch(e => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '提示设置 - 保存失败，' + e
                });
            });
        }
    }
});
</script>
<style scoped>

</style>