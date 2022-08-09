<template>
    <el-form :model="basicSetting" label-width="100px" style="width: 500px">
        <el-form-item label="博客类型">
            <el-radio-group v-model="basicSetting.blogType">
                <el-radio label="hexo">Hexo</el-radio>
                <!-- <el-radio label="vuePress">VuePress</el-radio> -->
            </el-radio-group>
        </el-form-item>
        <el-form-item label="字体">
            <el-select v-model="basicSetting.font">
                <el-option label="霞鹜文楷" value="LXGWWenKai"></el-option>
                <el-option label="微软雅黑" value="微软雅黑"></el-option>
                <el-option label="宋体" value="宋体"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="项目目录">
            <el-input v-model="basicSetting.path" disabled>
                <template #append>
                    <el-button :icon="folder" @click="openFolderDialog"/>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="开发工具">
            <el-button type="primary" @click="openDevTools">打开开发工具</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {useSettingStore} from '@/store/SettingStore';
import {Folder} from "@element-plus/icons-vue";
import ApplicationApi from "@/api/ApplicationApi";
import {ElMessage} from "element-plus";

export default defineComponent({
    name: "basic-setting",
    setup() {
        const folder = markRaw(Folder);
        return {
            folder
        }
    },
    data: () => ({
        basicSetting: useSettingStore().basicSetting
    }),
    watch: {
        "basicSetting.font": (value) => {
            document.getElementsByTagName('body')[0]!.style.fontFamily = `${value}, "Microsoft YaHei", Arial, sans-serif`
        }
    },
    methods: {
        openDevTools() {
            ApplicationApi.openDevTools().then(() => {
                ElMessage({
                    showClose: true,
                    type: "success",
                    message: "打开成功"
                })
            });
        }
    }
});
</script>
<style scoped>
</style>