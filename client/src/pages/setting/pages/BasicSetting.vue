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
        <el-form-item label="展示侧栏">
            <el-switch v-model="basicSetting.showSide" active-text="true" inactive-text="false" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Folder} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {settingService} from "@/global/BeanFactory";

export default defineComponent({
    name: "basic-setting",
    setup() {
        const folder = markRaw(Folder);
        return {
            folder
        }
    },
    data: () => ({
        basicSetting: settingService.getBasic(),
    }),
    watch: {
        "basicSetting.font": (value) => {
            document.getElementsByTagName('body')[0]!.style.fontFamily = `${value}, "Microsoft YaHei", Arial, sans-serif`
        }
    },
    methods: {
        save() {
            settingService.saveBasic(this.basicSetting).then(() => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: '基础设置 - 保存成功'
                })
            }).catch(e => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '基础设置 - 保存失败，' + e
                });
            });
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