<template>
    <el-form :model="basicSetting" label-width="100px" style="width: 500px">
        <el-form-item label="博客类型：">
            <el-radio-group v-model="basicSetting.blogType">
                <el-radio label="hexo">Hexo</el-radio>
                <!-- <el-radio label="vuePress">VuePress</el-radio> -->
            </el-radio-group>
        </el-form-item>
        <el-form-item label="博客类型：">
            <el-select v-model="basicSetting.font">
                <el-option label="霞鹜文楷" value="LXGWWenKai"></el-option>
                <el-option label="微软雅黑" value="微软雅黑"></el-option>
                <el-option label="宋体" value="宋体"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {useSettingStore} from '@/store/SettingStore';

export default defineComponent({
    data: () => ({
        basicSetting: useSettingStore().basicSetting
    }),
    name: 'blog-setting',
    watch: {
        "basicSetting.font": (value) => {
            document.getElementsByTagName('body')[0]!.style.fontFamily = `${value}, "Microsoft YaHei", Arial, sans-serif`
        }
    }
});
</script>
<style scoped>
</style>