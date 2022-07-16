<template>
    <el-form :model="basicSetting" label-width="120px" style="width: 500px">
        <el-form-item label="站点源文件路径">
            <el-input v-model="basicSetting.path">
                <template #append>
                    <el-button :icon="folder" @click="openPathDialog" />
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="node文件路径">
            <el-input v-model="basicSetting.nodePath">
                <template #append>
                    <el-button :icon="folder" @click="openNodeDialog" />
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="npm文件路径">
            <el-input v-model="basicSetting.npmPath">
                <template #append>
                    <el-button :icon="folder" @click="openNpmDialog" />
                </template>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary">保存</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { defineComponent, markRaw } from "vue";
import { Folder } from "@element-plus/icons-vue";
import { open } from '@tauri-apps/api/dialog';

export default defineComponent({
    setup() {
        const folder = markRaw(Folder);
        return {
            folder
        }
    },
    name: 'basic-setting',
    data: () => ({
        basicSetting: {
            path: '',
            nodePath: '',
            npmPath: ''
        }
    }),
    methods: {
        async openPathDialog() {
            const selected = await open({
                title: '请选择项目存储目录',
                directory: true,
                multiple: false,
            });
            if (typeof selected === 'string') {
                this.basicSetting.path = selected as string;
            }
        },
        async openNodeDialog() {
            const selected = await open({
                title: '请选择node文件路径',
                multiple: true,
                filters: [{
                    name: 'Application',
                    extensions: ['exe']
                }]
            });
            if (typeof selected === 'object' && selected) {
                this.basicSetting.nodePath = (selected as string[])[0];
            }
        },
        async openNpmDialog() {
            const selected = await open({
                title: '请选择npm文件路径',
                multiple: true,
                filters: [{
                    name: 'Application',
                    extensions: ['cmd', 'sh']
                }]
            });
            if (typeof selected === 'object' && selected) {
                this.basicSetting.npmPath = (selected as string[])[0];
            }
        }
    }
});
</script>
<style scoped>
</style>