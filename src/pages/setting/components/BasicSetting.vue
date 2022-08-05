<template>
    <el-form :model="basicSetting" label-width="100px" style="width: 500px">
        <el-form-item label="博客类型：">
            <el-radio-group v-model="basicSetting.blogType">
                <el-radio label="hexo">Hexo</el-radio>
                <!-- <el-radio label="vuePress">VuePress</el-radio> -->
            </el-radio-group>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useSettingStore } from '@/store/SettingStore';

export default defineComponent({
    data: () => ({
        basicSetting: useSettingStore().basicSetting
    }),
    name: 'blog-setting',
    methods: {
    }
});
</script>
<style scoped>
</style>