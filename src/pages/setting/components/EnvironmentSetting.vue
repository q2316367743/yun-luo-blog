<template>
    <el-form :model="environmentSetting" label-width="120px" style="width: 500px">
        <el-form-item label="node文件路径">
            <el-input v-model="environmentSetting.nodePath">
                <template #append>
                    <el-button :icon="folder" @click="openNodeDialog"/>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="npm文件路径">
            <el-input v-model="environmentSetting.npmPath">
                <template #append>
                    <el-button :icon="folder" @click="openNpmDialog"/>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="hexo文件路径">
            <el-input v-model="environmentSetting.hexoPath">
                <template #append>
                    <el-button :icon="folder" @click="openHexoDialog"/>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="git文件路径">
            <el-input v-model="environmentSetting.gitPath">
                <template #append>
                    <el-button :icon="folder" @click="openGitDialog"/>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="npm镜像">
            <el-input v-model="environmentSetting.npmMirror" placeholder="如不熟悉请勿更改"/>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Folder} from "@element-plus/icons-vue";
import DialogApi from "@/api/DialogApi";
import {settingService} from "@/global/BeanFactory";
import {ElMessage} from "element-plus";

export default defineComponent({
    setup() {
        const folder = markRaw(Folder);
        return {
            folder
        }
    },
    name: 'environment-setting',
    data: () => ({
        environmentSetting: settingService.getEnvironment()
    }),
    methods: {
        async openNodeDialog() {
            const selected = await DialogApi.open({
                title: '请选择node文件路径',
                multiple: true,
                defaultPath: 'C:\\Program Files',
                filters: [{
                    name: 'Application',
                    extensions: ['exe']
                }]
            });
            if (typeof selected === 'object' && selected) {
                this.environmentSetting.nodePath = (selected as string[])[0];
            }
        },
        async openNpmDialog() {
            const selected = await DialogApi.open({
                title: '请选择npm文件路径',
                multiple: true,
                defaultPath: this.environmentSetting.nodePath === '' ? 'C:\\Program Files' : this.environmentSetting.nodePath,
                filters: [{
                    name: 'Application',
                    extensions: ['cmd', 'sh']
                }]
            });
            if (typeof selected === 'object' && selected) {
                this.environmentSetting.npmPath = (selected as string[])[0];
            }
        },
        async openHexoDialog() {
            const selected = await DialogApi.open({
                title: '请选择hexo文件路径',
                multiple: true,
                defaultPath: this.environmentSetting.nodePath === '' ? 'C:\\Program Files' : this.environmentSetting.nodePath,
                filters: [{
                    name: 'Application',
                    extensions: ['cmd', 'sh']
                }]
            });
            if (typeof selected === 'object' && selected) {
                this.environmentSetting.hexoPath = (selected as string[])[0];
            }
        },
        async openGitDialog() {
            const selected = await DialogApi.open({
                title: '请选择git文件路径',
                multiple: true,
                defaultPath: 'C:\\Program Files',
                filters: [{
                    name: 'Application',
                    extensions: ['exe']
                }]
            });
            if (typeof selected === 'object' && selected) {
                this.environmentSetting.gitPath = (selected as string[])[0];
            }
        },
        save() {
            settingService.saveEnvironment(this.environmentSetting).then(() => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: '环境设置 - 保存成功'
                });
            }).catch(e => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '环境设置 - 保存失败，' + e
                });
            });
        }
    }
});
</script>
<style scoped>
</style>