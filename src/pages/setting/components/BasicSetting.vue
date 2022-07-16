<template>
    <el-form :model="basicSetting" label-width="120px">
        <el-form-item label="站点源文件路径">
            <el-input style="width: 300px;" v-model="basicSetting.path" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary">保存</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'basic-setting',
    data: () => ({
        basicSetting: {
            path: ''
        }
    }),
});
</script>
<style scoped>
</style>