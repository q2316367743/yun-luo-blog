<template>
    <el-form :model="basicSetting" label-width="100px" style="width: 500px">
        <el-form-item label="博客类型">
            <el-radio-group v-model="basicSetting.blogType">
                <el-radio label="hexo">Hexo</el-radio>
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
            <div class="project-dir">
                <el-tooltip
                    effect="light"
                    content="点击打开项目文件夹"
                    placement="top"
                >
                    <div class="project-path" @click="openProjectDir">{{ basicDir }}</div>
                </el-tooltip>
                <div class="project-button">
                    <el-button :icon="folder"/>
                </div>
            </div>
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
import Constant from "@/global/Constant";
import NativeApi from "@/api/NativeApi";

export default defineComponent({
    name: "basic-setting",
    setup() {
        const folder = markRaw(Folder);
        return {
            folder
        }
    },
    data: () => ({
        basicSetting: useSettingStore().basicSetting,
        basicDir: "",
    }),
    created() {
        this.queryBasicDir();
    },
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
        },
        openProjectDir() {
            Constant.FOLDER.POST().then(path => {
                NativeApi.openFolder(path);
            })
        },
        queryBasicDir() {
            Constant.FOLDER.BASE().then(path => {
                this.basicDir = path;
            })
        }
    }
});
</script>
<style scoped lang="less">
.project-dir {
    display: flex;
    background-color: #f5f7fa;
    border: #e4e7ed solid 1px;
    border-radius: 4px;
    height: 32px;
    padding: 0;

    .project-path {
        padding: 1px 11px;
        line-height: 30px;
        width: 300px;
        cursor: pointer;
    }

    .project-button {
        border-left: 0;
        background-color: #f5f7fa;
        color: #909399;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 100%;
        padding: 0 20px;
        white-space: nowrap;
        border-left: #dcdfe6 solid 1px;

        .el-button {
            border-color: transparent;
            background-color: transparent;
            color: inherit;
            display: inline-block;
            margin: 0 -20px;
            font-size: inherit;
        }
    }

}
</style>